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
  })
  .on('end',function(count){
    db.save(docs, function(err, res) {
      console.error(err);
      console.log(res);
      console.log('Calling the view...');
      db.view('app/times_by_stop', { limit : '10' }, function (err, res) {
        console.log('Back from calling the view...');
        console.log(err);
        console.log(res);
      });
    });
  })
  .on('error',function(error){
    console.log(error.message);
  });