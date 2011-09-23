/**
 *  stops_txt_to_geojson.js 
 * 
 *  A script to easily create CouchDB-ready, geojson-formatted, json files based on 
 *  GTFS stops.txt files
 *  
 *  Author: @mertonium
 */
var csv = require('csv'),
     fs = require('fs'),
      _ = require('underscore');

var bigFNObj = [];
var jsonFile;

var args = process.argv.slice(2);
if(args.length == 3) {
  
  var config = { 
    stopfile : args[0],
    jsonfile : args[1],
    api : args[2]
  }
 
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
} else {
  console.log("Proper usage:");
  console.log('node stops_txt_to_geojson.js stops.txt stops.json source');
}