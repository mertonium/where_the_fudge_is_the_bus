var jsdom = require('jsdom');

exports.getNextTrip = function(stop_id, options) {
  var stop_id = process.argv[2] || '16126';

  var options = {
    nexTripUrl: 'http://metrotransit.org/Mobile/Nextrip.aspx?stopnumber='+stop_id,
    containerId: 'ctl00_mainContent_NexTripControl1_UPanelNextripOuter'
  };

  var theDom = jsdom.env(options.nexTripUrl,
    ['http://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js'],
    function(errors, window) {
      var routes = [], i = 0;

      var $panel = window.$('#'+options.containerId);

      var retObj = {
        next_departure: $panel.find('.countdown').text(),
      };

      var rows = $panel.find('.nextripDepartures .data');
      for(i=0; i < rows.length; i+=1){
        $r = window.$(rows[i]);
        routes.push({
          route_short_name: $r.find('.col1').text(),
          route_long_name: $r.find('.col2').text(),
          next_arrival: $r.find('.col3').text()
        });
      }

      retObj.routes = routes;

      console.log(retObj);
    }
  );
};