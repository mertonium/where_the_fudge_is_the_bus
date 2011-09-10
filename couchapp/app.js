var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/app'
  , rewrites: 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}    
    , {from:"/api/*", to:'../../*'}
    , {from:"/script", to:'../script'}
    , {from:"/script/*", to:'../script/*'}
    , {from:"/style", to:'/style'}
    , {from:"/style/*", to:'/style/*'}
    , {from:"/images", to:'/images'}
    , {from:"/images/*", to:'/images/*'}
    , {from:"/:action", to:'index.html'}
    , {from:"/:action/:id", to:'index.html'}
    , {from:"/*", to:'*'}
    ]
  }
  ;
  
ddoc.views = {
  /**
   * A simple map function mocking _all, but allows usage with lists etc.
   */
  all: {
    map: function(doc) {
      emit(doc._id, doc);
    }
  },
  headers: {
    map: function(doc) {
      var keys = [];
      for (var key in doc) {
        emit(key, 1);        
      }
    },
    reduce: "_sum"
  },
  times_by_stop: {
    map: function(doc) {
      if(doc.type === "stop_time") emit(doc.stop_id , doc);
    }
  },
  by_trip_id: {
    map: function(doc) {
      if(doc.type === "trip") emit(doc.trip_id, doc);
    }
  },
  trips_by_stop_id: {
    map: function(doc) {
      if(doc.type === "stop") emit(doc.stop_id, null);
    },
    reduce: function (key, values, rereduce) {
        return null;
    }
  },
  by_date: {
    map: function(doc) {
      if(doc.type === "database") emit(doc.createdAt, doc.name);
    }
  },
  popular: {
    map: function(doc) {
      if(doc.hits) emit(doc.hits);
    }
  },
  apps: {
    map: function(doc) {
      if(doc.type === "app") emit(doc.name);
    }
  }
};


couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;