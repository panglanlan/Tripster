var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var tripPage = require('./tripPage');
var userprofile = require('./userprofile');

exports.do_work = function(req, res){
	//add_trip_info(res, req);
	console.log(req.body.tripID);
	res.render('addAlbum.jade',
			   { userID: "h",
		         tripID: req.body.tripID,
			     results: "results"}
		  );
};

exports.add_album = function(req, res){
	console.log("enter add_album");
	console.log("userID = " + userID);
	console.log("tripID = " + req.body.tripID);
	console.log("album_name = " + req.body.album_name);
	console.log("privacy = " + req.body.privacy);
	chooseAlbumID(res, userID, req.body.album_name, req.body.tripID,
			 req.body.privacy, req.body.tag);
//	albumInformation(res, userID, req.body.album_name, req.body.album_id, req.body.tripID,
//			 req.body.privacy, req.body.tag);
};

function chooseAlbumID(res, userID, album_name, 
		trip_id, privacy, tag) {
	console.log(userID, album_name,  
			privacy, tag);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT MAX(ALBUM_ID)  AS ALBUM_ID FROM ADDALBUM";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,userID); 
		  	    	albumInformation(res, userID, album_name, results[0].ALBUM_ID + 1, 
		  	    			trip_id, privacy, tag);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
};

function albumInformation(res, userID, album_name, album_id, 
		trip_id, privacy, tag) {
	console.log(userID, album_name, album_id, 
			privacy, tag);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO ADDALBUM VALUES('"+ userID +"' , '"+ userID +"' , '" + album_id +"', '" + trip_id +"', " +
	    			"'" + album_name +"'," +
	    							" '" + privacy +"', '"+ tag +"')";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,userID); 
		  	    	show_trip(res,tripID);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
};


function show_trip(res,tripID){
	
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT * FROM TRIP WHERE TRIP_ID='" + tripID + "'";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("query trip information success");
		  	    	
		  	    	show_album(res,tripID, results[0]); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect



	function show_album(res, tripID, results){
		oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var query_album = "SELECT * FROM ADDALBUM WHERE user_id = '" + userID + 
		    	"' AND TRIP_ID = '" + tripID + "'";
		    	
			  	connection.execute(query_album, 
			  			   [], 
			  			   function(err, results_album) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	console.log("Query Success");
			  	    	//console.log(results_trip);
			  	    	global.tripID = tripID;
			  	    	
			  	    	output_trip_album(res, results, results_album);
			  	    	connection.close(); // done with the connection
			  	    	
			  	    }
			
			  	}); // end connection.execute		  	
		    };
		  }); // end oracle.connect
		
	}
	
	

function output_trip_album(res, results, results_album) {
	res.render('trip.jade',
		   { tripID: results.TRIP_ID,
		     tripName: results.TRIP_NAME,
		     expense: results.EXPENSE,
		     schedule: results.SCHEDULE,
		     hotel: results.HOTEL,
		     hotel_hyperlink: results.HOTEL_HYPERLINK,
		     privacy: results.PRIVACY,
		     feature: results.FEATURE,
		     results: results,
		     msg: "Successfully added new album",
		     results_album: results_album}
	  );
};
};

//function backtoprofile(req,res) {
//	userprofile.do_work(req,res);

//};




//function backtoprofile(res,req) {
//	userprofile.do_work(res,req);
//	//res.render('userprofile', {fail:fail});
//}


