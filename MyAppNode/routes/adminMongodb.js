var MongoDb = require("mongodb");


    db = new MongoDb.Db("test", new MongoDb.Server("localhost", 27017, {auto_reconnect: true}, {}),{fsync:false}),
    fs = require("fs");
var GridStore = MongoDb.GridStore;
var assert = require('assert');

var connectData = { 
		"hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");

var events = require('events');
var EventEmitter = events.EventEmitter;

var flowController = new EventEmitter();

exports.adminMongo = function (req,res) {

	//Get the list of objects saying yes at 'iscached'
	var cachedList;
	db.open(function(err, db) {console.log(err)}); // end of db.open
	console.log("db._state:"+db._state);
	
				oracle.connect(connectData, function(err, connection) {
				    if ( err ) {
				    	console.log(err);
				    } else {
				    	
				    	var query="select url from objects group by url having count(*)>=5";
				    	
					  	connection.execute(query, 
					  			   [], 
					  			   function(err, results) {
					  	    if ( err ) {
					  	    	console.log(err);
					  	    } else {
					  	    	connection.close(); // done with the connection
					  	    	//("results "+results);
					  	    	
					  	    	cachedList = results;
					  	    	
								console.log("save to mongo");
							  	saveAllToMongo(results,function(str){
							  		console.log(str);
							  		renderMongoDone(res);
							  	});
					  	    }
					
					  	}); // end connection.execute
				    }
				  }); // end oracle.connect
				
							
				
		
};

function renderMongoDone(res) {
	//res.render('adminMongo_done',{});
	res.send("store success");
}


var saveAllToMongo= function(cachedList, callback){
	// make imageNames for MongoDB and check
	var imageType = {};
	var imageName = {};
	var imageUrl = {};


    var del = 1;
    var ms = 500;
	var i,j,k,x,y;
	
	
	console.log(cachedList);	
	console.log(cachedList.length);	
    
	
    
    // Loop for each image, check if it is on Mongo. If not, then store it. 
   
    	i = 0;
    	imageType = cachedList[i].URL.charAt(cachedList[i].URL.length-3) + cachedList[i].URL.charAt(cachedList[i].URL.length-2) +cachedList[i].URL.charAt(cachedList[i].URL.length-1);

    	imageUrl = cachedList[i].URL;
    	imageName = imageUrl;

          	
        
        
        	flowController.on('doWork', function (i) {
        		console.log("i:"+i);
        		if (i > cachedList.length) {
        		    flowController.emit('finished');
        		    return;
        		  }
        		
        		asnycfunction(imageUrl, imageName,imageType, db, function(){
        			if (i<cachedList.length){
        			imageType = cachedList[i].URL.charAt(cachedList[i].URL.length-3) + cachedList[i].URL.charAt(cachedList[i].URL.length-2) +cachedList[i].URL.charAt(cachedList[i].URL.length-1);
        			
        	    	imageUrl = cachedList[i].URL;
        	    	imageName = imageUrl;
        			}
        			flowController.emit('doWork', i + 1);
        		} );
          	    		
          	    			
          	  });
        		

        	flowController.on('finished', function () {
        	  console.log('finished');
        	  var endStr = 'done';
        	  callback(endStr);
        	});  
        	flowController.emit('doWork', 0);
        	
        	
   }
        
        	    		
        	    	
        	    		// iscached = T
        	    		
        	        	      
        	    	
        	
        		
        		
       	

var asnycfunction = function(imageUrl, imageName, imageType, db, callback){
	if(imageType.toUpperCase()=="JPG"||imageType.toUpperCase()=="PNG"||imageType.toUpperCase()=="BMP"||imageType.toUpperCase()=="GIF"){
	// store 
	  console.log("in async function");
	  loadBase64Image(imageUrl, function (image, prefix) {
	    		
		  console.log("prefix "+prefix);
	      saveImageGrid(imageName, image, db, function(){
//	    	  setcached(objectID, srcID, function(){
	    		  callback(prefix);
//	    	  } );
	      } );
	  });
	  console.log(imageName + " Saved to MongoDB");
	 
	}// end if
	else
		{
		console.log("Unsupportable image skipped");
		callback(imageType);
		}
	
	
}

var loadBase64Image = function (url, callback) {
    // Required 'request' module
    var request = require('request');
    console.log("in loadBase64Image");
    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};

var saveImageGrid = function (imageName, imageData, db, callback){
	console.log("in save image grid");
	if(db._state=='connected' || db._state=='connecting')
		{
		var gs = new GridStore(db, imageName, "w");
	      // Open the file
	      gs.open(function(err, gs) {
	    	  if(err) throw err;
	     	 console.log('Open GridStore to save an image..');
	        gs.write(imageData, function(err, gs) {
	        	if(err) throw err;
	        	 console.log('Writing the image..');
	          gs.close(function(err, gs) {
	        	  if(err) throw err;
	         	 console.log('Closing GS..');
	         	 callback(err);
	       	         
	          }); // end of gs.close
	        }); // end of gs.write
	      }); // end of gs.open
		
		}
	else
		{
		db.open(function(err, db) {
	
	      // Create a new file
	      var gs = new GridStore(db, imageName, "w");
	      // Open the file
	      gs.open(function(err, gs) {
	    	  if(err) throw err;
	     	 //console.log('Open GridStore to save an image..');
	        gs.write(imageData, function(err, gs) {
	        	if(err) throw err;
	        	 //console.log('Writing the image..');
	          gs.close(function(err, gs) {
	        	  if(err) throw err;
	         	//console.log('Closing GS..');
	        	  callback(err);
	

	          }); // end of gs.close
	        }); // end of gs.write
	      }); // end of gs.open
	}); // end of db.open
		}

}

var setcached = function(objID, sourceID, callback)
{
	// Set them 'T' for iscached
	console.log('set cached');
	console.log(objID + sourceID);
	
		oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		   
		    	var query="update object set iscached='T' where id=" + objID + " and source='" + sourceID +"'";
		    	
			  	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    	callback(results);
			  	    } else {
			  	    	//console.log(objID +" " +sourceID + " set to T" );
			  	    	
			  	    	connection.close(results); // done with the connection		
			  	    	callback();
			  	    	//delayy(500);
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect

}

