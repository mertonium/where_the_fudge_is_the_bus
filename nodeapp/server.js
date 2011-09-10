var jsdom = require('jsdom');

var stop_id = process.argv[2] || '16126';

var options = {
  nexTripUrl: 'http://metrotransit.org/Mobile/Nextrip.aspx?stopnumber='+stop_id,
  containerId: 'ctl00_mainContent_NexTripControl1_UPanelNextripOuter'
};

var firstDom = jsdom.env(options.nexTripUrl,
  ['http://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js'],
  function(errors, window) {
    var routes = [];
    var $panel = window.$('#'+options.containerId);

    var retObj = {
      next_departure: $panel.find('.countdown').text(),
    };
    
    var rows = $panel.find('.row');
console.log(rows.length);
    if(rows.length) {
      rows.forEach(function(row, idx) {
        routes.push({
          route_short_name: row.find('.col1').text(),
          route_long_name: row.find('.col2').text(),
          next_arrival: row.find('.col3').text()
        });
      });
    }

    retObj.routes = routes;

    console.log('first jsdom callback');
    console.log('-----------------');
    console.log(window.$('#ctl00_mainContent_NexTripControl1_UPanelNextripOuter').html());
    console.log('**********');
    console.log(retObj);
  }
);