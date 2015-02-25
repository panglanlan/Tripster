var connectData = { 
		"hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");

var back_to_photos = require('./showContents');
var userprofile = require('./userprofile');
var adminMongodb = require('./adminMongodb');

exports.do_work = function(req, res){
	var value = req.body.objectID.split("|");	

	var albumID = value[0];
	var tripID = value[1];
	console.log(albumID, tripID);
	res.render('addContents.jade',
			   { 
		         tripID: tripID,
		         albumID: albumID
			     }
		  );
};

exports.add_contents = function(req, res){
	console.log("enter add_content");
	console.log("userID = " + userID);
	console.log("tripID = " + req.body.tripID);
	console.log("albumID = " + req.body.albumID);
	
	choosePhotoID(res, userID, req.body.url, req.body.tripID, req.body.albumID, req.body.objectID, req.body.tag, req.body.objectSource, req.body.objectType);
	//checkValidURL(res, userID, req.body.url, req.body.tripID, req.body.albumID, req.body.objectID, req.body.tag, req.body.objectSource, req.body.objectType);
};

function choosePhotoID(res, userID, url, tripID, albumID, objectID,tag, objectSource, objectType) {
	//console.log(userID, trip_name,  schedule, hotel, hotel_url, expense, feature, privacy);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT MAX(OBJECT_ID)  AS OBJECT_ID FROM OBJECTS";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,userID);
		  	    	console.log(results[0]);
		  	  //   trip_id = results[0].TRIP_ID + 1;
		  	    	//console.log(tri_id)
		  	    	checkValidURL(res, userID, url, tripID, albumID, results[0].OBJECT_ID + 1, tag, objectSource, objectType);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
};


function checkValidURL(res, userID, url, tripID, albumID, objectID, tag, objectSource, objectType){
  	if(objectID-1==580){
  		adminMongodb.adminMongo();
  		
  	}
	if(url==null || url==""||url.length<=3){
		//output_result(res,"Invalid  URL ! Failed to add photos ", false);
	}
	else {
		//res.send("stop");
		insert_photo(res,userID, url,tripID, albumID, objectID, tag, objectSource, objectType);
	}
		
}


function insert_photo(res, userID, url, tripID, albumID, objectID, tag, objectSource, objectType) {

	
	  console.log("photo url is: "+ url);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log(objectID);
	    	var count = 1;
	    	var iscach = 'N';
	    	var query="INSERT INTO OBJECTS VALUES('"+ objectID +"' , '"+ objectSource +"' , '" + objectType +"', '" + userID +"', " +
			"'" + userID +"'," +
							" '" + tripID +"', '"+ url +"', '"+ albumID +"', '"+ tag +"','" + count + "','" + iscach +"')";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    	
		  			  	    	//output_result(res,"Failed to add photos ", false);
		  			  	    } else {
		  			  	    	
		  			  	    	
		  			  	   // backtoprofile(res, userID );
		  			  	    console.log("insert successful");
		  			  	    show_contents(res, userID, albumID, tripID);
		  			  	    	connection.close(); // done with the connection
		  	    };
				
	  	}); // end connection.execute
    };
  }); // end oracle.connect
}

//function backtoprofile(res,req) {
//	userprofile.do_work(res,req);

//};

function show_contents(res, userID, albumID, tripID){
	
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT * FROM OBJECTS WHERE ALBUM_ID = '" + 
	    	albumID +"' AND TRIP_ID = '" + tripID + "' ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if(results.length == 0){
		  	    		out_put_zero_photo(res, userID, albumID, tripID);
		  	    	}
		  	    	else{
		  	    	
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("query trip information success");
		  	    	var msg = "enjoy photos!";
		  	    	output_photos(res, results, msg); }
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

	
function out_put_zero_photo(res, userID, albumID, tripID){
		
		oracle.connect(connectData, function(err, connection) {
			  
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	
		    	var query="SELECT * FROM ADDALBUM WHERE ALBUM_ID = '" + 
		    	albumID +"' AND TRIP_ID = '" + tripID + "' ";
			  	connection.execute(query, 
			  			   [], 
			  			   function(err,results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	

			  	    	//console.log("Query Executed")
			  	    	connection.close(); // done with the connection
			  	    	console.log("query trip information success");
			  	    	var msg = "its empty, try add more photos";
			  	    	output_photos_zero(res, results, msg); 
			  	    }
			
			  	}); // end connection.execute
			  	
		    };
		  }); // end oracle.connect
		
	}
function output_photos_zero(res, results_photos, msg){
	res.render('showContents.jade',
		   { 
		     results_photos: results_photos,
		     state: false,
		     msg: msg}
	  );
}
	
function output_photos(res, results_photos, msg){
	console.log(results_photos[0].URL);
	console.log(results_photos);
	console.log(msg);
	console.log(res);
	
	res.render('showContents.jade',
	//res.render('test.jade',
		   { 
		     results_photos: results_photos,
		     state: true,
		     msg: msg
		     }
	  );
}

/*function output_result(res,msg,success){
	
	res.render('addContents.jade',
			{msg : msg,
		     state: fail,
		     });
}*/

