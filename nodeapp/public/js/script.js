/* Author: John Mertens @mertonium


*/
var WTFIMB = {};

(function(m) {
  m.app = function() {
    var files_house = { coords: { latitude: 44.98680, longitude: -93.25217 }};
    var cur_pos = null;
    var couch = {
      host: 'http://localhost:5984',
      db:   'msp_stops'
    };

    var init = function() {
      loadRoutes();
    };

    var loadRoutes = function() {
      // Figure out where we are
      getPos(function(pos, error) {
        if(error) {
          console.error(error);
          cur_pos = files_house;
        } else {
          console.log(pos);
          cur_pos = pos;
        }

        $('#lat').html(cur_pos.coords.latitude);
        $('#lng').html(cur_pos.coords.longitude);

        // Find all the near-by stops
        findStops(cur_pos, function(stops) {
          var i = 0, s = null;
          var $stopBlock;
        
          console.log(stops);
          // Loop through the stops and figure out what the next bus is
          for(; i < stops.length; i+=1) {
            s = stops[i].value;
          
            $stopBlock = $('<li id="stop_'+s.stop_id+'" class="stop-block"><span class="stop-name">'+s.stop_name + ' (' + s.stop_desc +')</span><ul></ul></li>');
          
            // Get the realtime info for each stop
            $.get('/nextrip/'+s.stop_id,{}, function(data) {
              var j = 0, connector = '', route;
              var routes = data.routes;
              console.log(data);
            
              // Loop through each arrival, building the 
              for(; j < routes.length; j += 1) {
                route = routes[j];
                connector = (route.next_arrival.toLowerCase().indexOf('min') != -1) ? 'in' : 'at';
                $stopBlock.find('ul').append('<li class="route"><div class="response">Dude, the next '+route.route_short_name+' is '+connector+' '+route.next_arrival+'</div><div class="details">'+route.route_long_name+'</div></li>');
              }

              // Add all our results to the main block
              $('#the_routes').append($stopBlock);
            });
          }
        });
      });
    };

    var getPos = function(callback) {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
          function(pos) { callback(pos); }, 
          function(error) { callback(null, error); }
        );
      } else {
        console.log('Geolocation is not available.');
      }
    };
  
    var findStops = function(pos, callback) {
      console.log('in findStops');
      var bbox = getBbox(pos);
      var opts = {
        url: couch.host+'/'+couch.db+'/_design/geo/_spatial/full?bbox='+bbox,
        crossDomain: true,
        dataType: 'jsonp',
        success: function(_stops) {
          console.log(_stops);
          _stops = _stops.rows;        
          $.each(_stops, function(idx, stop) {
              stop.distance = quickDist(pos.coords.latitude, pos.coords.longitude, stop.geometry.coordinates[1], stop.geometry.coordinates[0]);
          });

          // Sort the murals from closest to farthest
          _stops.sort(function(a, b) { return  a.distance - b.distance; });
        
          // Only keep the closest 5
          _stops = _stops.slice(0,5);
        
          //console.log(_stops);
          callback(_stops);
        }
      };
    
      $.ajax(opts, function(data) {
        callback(data);
      });
    };
  
    var getBbox = function(pos) {
      var factor = 0.016;  // About a mile...
      var bbox = [
        pos.coords.longitude - factor, 
        pos.coords.latitude - factor, 
        pos.coords.longitude + factor, 
        pos.coords.latitude + factor
      ];
    
      return bbox.join(','); 
    };
  
    // http://www.movable-type.co.uk/scripts/latlong.html
    var quickDist = function(lat1, lon1, lat2, lon2) {
      var R = 20902231; // radius of the earth in ft
      var d = Math.acos(Math.sin(lat1.toRad())*Math.sin(lat2.toRad()) + 
                        Math.cos(lat1.toRad())*Math.cos(lat2.toRad()) *
                        Math.cos(lon2.toRad()-lon1.toRad())) * R;
      return d;
    };
  
    return {
      init: init
    }
  }  
})(WTFIMB);

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

/** Converts radians to numeric (signed) degrees */
if (typeof(Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}

// Kick off the app
$(function() { WTFIMB.app().init(); });