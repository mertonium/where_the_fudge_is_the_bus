/* Author: John Mertens (http://mertonium.com)


*/
var WTFIMB = {
};

(function(m) {
  m.app = function() {
    var ENV = 'dev';
    var files_house = { coords: { latitude: 44.98680, longitude: -93.25217 }};
    var cur_pos = null;
    var couch = {
      host: 'http://x.iriscouch.com',
      db:   'msp_stops'
    };

    var init = function() {
      $('#the_loader').show();
      loadRoutes();
      bindHandlers();
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
          var i = 0;
          var $stopBlock;
          var totalStops = stops.length;
          var finishedCount = 0;

          //console.log(stops);
          if(totalStops === 0) {
            $('#the_loader').html('<div class="out-of-range">Sorry, dude. We can\'t find any bus stops near you.</div>');
            $('#controls').hide();
          } else {
            // Loop through the stops and figure out what the next bus is
            $.each(stops, function(idx, stop) {

              var s = stop.value;

              // Get the realtime info for each stop
              $.get('/nextrip/'+s.stop_id,{}, function(data) {
                $stopBlock = $('#the_routes');
                var j = 0, connector = '', route, herro = '';
                var uniqueRoutes = [];
                var routes = data.routes;
                //console.log(data);

                // Loop through each arrival, building the
                for(; j < routes.length; j += 1) {
                  route = routes[j];
                  if(uniqueRoutes.indexOf(route.route_short_name) == -1) {
                    uniqueRoutes.push(route.route_short_name);
                    connector = (route.next_arrival.toLowerCase().indexOf('min') != -1) ? 'in' : 'at';
                    if(Date.now() % 4 === 0) herro = humanTalk('bro') +', ';
                    $stopBlock.append('<li data-stop="'+s.stop_id+'" data-route="'+route.route_short_name+'"><div class="response">'+herro+'the next '+route.route_short_name+' is '+connector+' '+route.next_arrival+'</div><div class="details">(If you\'re looking for the '+route.route_long_name+' and you\'re at the '+s.stop_name+' stop.)</div></li>');
                  }
                }

                finishedCount += 1;

                if(finishedCount == (totalStops-1)) {
                  $('#the_loader').hide();
                  $('#controls').show();
                  $('#the_routes').children().first().addClass('cur-route');
                }
              });
            });
          }
        });
      });
    };

    var getPos = function(callback) {
      if(ENV == 'dev') callback(null,'testing...');

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
      var bbox = getBbox(pos);
      var opts = {
        url: couch.host+'/'+couch.db+'/_design/geo/_spatial/full?bbox='+bbox,
        crossDomain: true,
        dataType: 'jsonp',
        success: function(_stops) {
          //console.log(_stops);
          _stops = _stops.rows;
          $.each(_stops, function(idx, stop) {
              stop.distance = quickDist(pos.coords.latitude, pos.coords.longitude, stop.geometry.coordinates[1], stop.geometry.coordinates[0]);
          });

          // Sort the stops from closest to farthest
          _stops.sort(function(a, b) { return  a.distance - b.distance; });

          // Only keep the closest 5
          _stops = _stops.slice(0,5);

          //console.log(_stops);
          callback(_stops);
        }
      };

      $.ajax(opts);
    };

    var bindHandlers = function() {
      $('#the_routes').bind('swipeleft swiperight', function(ev) {
        console.log(ev);
        var $slider = $(this);
        var direction = (ev.type == 'swipeleft') ? 'next' : 'prev';
        var $currentWork = $slider.find('.cur-route');
        var curPos = parseInt($slider.css('marginLeft'), 10);
        var delta = $('.cur-route').outerWidth(true);

        var possible = (direction == 'next') ? $currentWork.next('li').length : $currentWork.prev('li').length;
        var newPos = (direction == 'next') ? (curPos - delta) : (curPos + delta);

        if(possible) {
          if(direction === 'next') {
            $currentWork.removeClass('cur-route').next('li').addClass('cur-route');
          } else {
            $currentWork.removeClass('cur-route').prev('li').addClass('cur-route');
          }
          $slider.animate({'marginLeft': newPos +'px'} , {
            duration: 1500,
            easing: 'easeOutBack',
            complete: function() {    }
          });
        }
      });
      // $('.button').bind('click', function(ev) {
      //         var $slider = $('#the_routes');
      //         var direction = ($(this).attr('id') == 'next') ? 'next' : 'prev';
      //         var $currentWork = $slider.find('.cur-route');
      //         var curPos = parseInt($slider.css('marginLeft'), 10);
      //         var delta = $('.cur-route').outerWidth(true);
      // 
      //         var possible = (direction == 'next') ? $currentWork.next('li').length : $currentWork.prev('li').length;
      //         var newPos = (direction == 'next') ? (curPos - delta) : (curPos + delta);
      // 
      //         if(possible) {
      //           if(direction === 'next') {
      //             $currentWork.removeClass('cur-route').next('li').addClass('cur-route');
      //           } else {
      //             $currentWork.removeClass('cur-route').prev('li').addClass('cur-route');
      //           }
      //           $slider.animate({'marginLeft': newPos +'px'} , {
      //             duration: 1500,
      //             easing: 'easeOutBack',
      //             complete: function() {    }
      //           });
      //         }
      //       });
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

    var humanTalk = function(type) {
      var vocab = {
        bro : ['Broseph Stalin','Angelina Brolie','Brobi Wan Kenobi','Brometheus','Bro Chi Minh',
          'Nabroleon Bronaparte','Evander Bro-lifield','Pete Brose','Bro Jackson','Vincent Van Bro',
          'Bromer Simpson','Marco Brolo','Yoko-Brono','Mr. Brojangles','Bro Diddley','Brosie O’Donnell',
          'Brohammed Ali','Bromeo','Bro J. Simpson','Brogi Berra','Edgar Allan Bro','Brohmygod',
          'Brostradamus','Bro Biden','Brommander In Chief','Ayatollah Bromeini'
        ]
      };
console.log(vocab);
console.log(type);
console.log(vocab[type]);
      return vocab[type][(Math.floor(Math.random() * ((vocab[type].length-1) + 1)))];
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