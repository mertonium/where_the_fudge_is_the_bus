var csv = require('csv');
var cur_shp = { 
  shape_id: -1,
  geometry: {
    type: "LineString", 
    coordinates: [] 
  }
};

var shp_array = [];
csv()
  .fromPath(__dirname+'/shapes.txt', { columns: true })
  .on('data',function(data,index){
//    console.log(data.shape_id+' == '+cur_shp.shape_id);
    if(data.shape_id == cur_shp.shape_id) {
      cur_shp.geometry.coordinates.push([data.shape_pt_lon, data.shape_pt_lat]);
    } else {
      shp_array.push(cur_shp);
      cur_shp = { 
        shape_id: data.shape_id,
        geometry: {
          type: "LineString", 
          coordinates: [[ data.shape_pt_lon, data.shape_pt_lat ]] 
        }
      };
    }
  })
  .on('end',function(count){
    shp_array.shift();
    for(s in shp_array) {  
      if(shp_array[s].coordinates) {
        console.log(shp_array[s].geometry.coordinates.length);
      } else {
        console.log(shp_array[s]);
      }
    }
    console.log(shp_array.length);
  })
  .on('error',function(error){
    console.log(error.message);
  });