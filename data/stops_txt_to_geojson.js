// 0fb3d8b5-e622-4151-9331-747618b52c20
var csv = require('csv');
var fs = require('fs');

var config = { 
  stopfile : __dirname+'/msp_stops.txt',
  jsonfile : __dirname+'/msp_stops.json',
  api : 'nextrip'
}

var bigFNObj = [];
var jsonFile;

csv()
.fromPath(config.stopfile, { columns: true })
.transform(function(data){
    data.geometry = { 
      type: "Point",
      coordinates: [ parseFloat(data.stop_lon, 10), parseFloat(data.stop_lat, 10) ]
    };
    data.type = 'stop';
    data.api = config.api;
    bigFNObj.push(data);
    return data;
})
.on('end',function(count){
    console.log('Number of lines: '+count);
    bigFNObj = { docs : bigFNObj };
    jsonFile = fs.open(config.jsonfile, 'w', function(err, fd) {
      if(err) {
        console.error(err);
      } else {
        fs.write(fd, JSON.stringify(bigFNObj), function(err, written, buffer) {
          console.log(written + ' bytes written.');
        });
      }
    });
})
.on('error',function(error){
    console.log(error.message);
});