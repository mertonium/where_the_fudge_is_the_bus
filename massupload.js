var csv     = require('csv'),
    cradle  = require('cradle');

var docs = [];
    
var successCount = 0,
    failCount = 0,
    curproc = 0,
    throttle = 5;
    
var db = new(cradle.Connection)().database('msp_transit');

csv()
  .fromPath(__dirname+process.argv[2], { columns: ['trip_id','arrival_time','departure_time','stop_id','stop_sequence','pickup_type','drop_off_type'] })
  .on('data',function(data,index){
    data.type = 'stop_time';
    docs.push(data);
    // while(curproc > throttle) { 
    //   //setTimeout(function(){ 
    //     console.log('waiting on stop # '+data.stop_id);
    //   //}, 1000); 
    // }
    // 
    // curproc += 1;
    // console.log('saving '+data.stop_id+' curproc = '+curproc);
    // db.save(data, function(err, res) {
    //   console.log(res);
    //   if(err) {
    //     failCount += 1;
    //     console.error(err);
    //   } else {
    //     successCount += 1;
    //   }
    //   curproc -= 1;
    // });
  })
  .on('end',function(count){
    db.save(docs, function(err, res) {
      console.error(err);
      console.log(res);
    });
    // console.log(successCount + ' successes.');
    // console.log(failCount + ' failures.');
  })
  .on('error',function(error){
    console.log(error.message);
  });