
exports.do_work = function(req, res){
	var value = req.body.albumID.split("|");	
	//console.log(req.body.albumID.spit("|"));
	var albumID = value[0];
	var tripID = value[1];
	var tripUserID = value[2];
	console.log(userID);
	show_contents(res, userID, albumID, tripID, tripUserID);
};

exports.do_work_2 = function(req,res){
	var value = req.body.albumID.split("|");	
	//console.log(req.body.albumID.spit("|"));
	var albumID = value[0];
	var tripID = value[1];
	var tripUserID = value[2];
	console.log(userID);
	console.log(tripUserID);
	show_contents(res, userID, albumID, tripID, tripUserID);
};

var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var bcrypt = require('bcryptjs');


function show_contents(res, userID, albumID, tripID, tripUserID){
	
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
		  	    		out_put_zero_photo(res, results, userID, albumID, tripID, tripUserID);
		  	    	}
		  	    	else{
		  	    	
		  	    		//console.log("Query Executed")
		  	    		connection.close(); // done with the connection
		  	    		console.log("query trip information success");
		  	    		var msg = "enjoy photos!";
		  	    		test_others_photo(res, results, msg, userID, albumID, tripID, tripUserID); }
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

function test_others_photo(res, results, msg, userID, albumID, tripID, tripUserID) {
	console.log("output trip page");
	if (tripUserID != userID) {
		oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var query_in_trip = "SELECT USER_ID_INVITED FROM INVITE WHERE USER_ID = '" + tripUserID + 
		    	"' AND TRIP_ID = '" + tripID + "' AND USER_ID_INVITED = '" + userID + "'AND STATUS = 'accepted'";
		    	
			  	connection.execute(query_in_trip, 
			  			   [], 
			  			   function(err, results_trip) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	console.log("Query Group Member Success");
			  	    	//console.log(results_trip[0]);
			  	    	connection.close(); // done with the connection	
			  	    	if(results_trip.length == 0){
			  	    		console.log("test");
			  	    		output_photos_others(res, results, msg, tripUserID);
			  	    	}else{
			  	    		console.log("test1");
			  	    		output_photos(res, results, msg, tripUserID);
			  	    	}
			  	    }
			
			  	}); // end connection.execute		  	
		    };
		  }); // end oracle.connect
	}else{
		output_photos(res, results, msg, tripUserID);
	}
}

function out_put_zero_photo(res, results, userID, albumID, tripID, tripUserID){
		
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
			  	    	test_others_zero_photo(res, results, msg, tripUserID, userID, tripID); 
			  	    }
			
			  	}); // end connection.execute
			  	
		    };
		  }); // end oracle.connect
		
	}

function test_others_zero_photo(res, results, msg, tripUserID, userID, tripID) {
	console.log("output trip page");
	if (tripUserID != userID) {
		oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var query_in_trip = "SELECT USER_ID_INVITED FROM INVITE WHERE USER_ID = '" + tripUserID + 
		    	"' AND TRIP_ID = '" + tripID + "' AND USER_ID_INVITED = '" + userID + "'AND STATUS = 'accepted'";
		    	
			  	connection.execute(query_in_trip, 
			  			   [], 
			  			   function(err, results_trip) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	console.log("Query Group Member Success");
			  	    	console.log(results_trip[0]);
			  	    	connection.close(); // done with the connection	
			  	    	if(results_trip[0] == null){
			  	    		console.log("test");
			  	    		output_photos_zero_others(res, results, msg, tripUserID); 
			  	    	}else{
			  	    		console.log("test1");
			  	    		output_photos_zero(res, results, msg, tripUserID); 
			  	    	}
			  	    }
			
			  	}); // end connection.execute		  	
		    };
		  }); // end oracle.connect
	}else{
		output_photos_zero(res, results, msg, tripUserID); 
	}
}

function output_photos_zero(res, results_photos, msg, tripUserID){
	res.render('showContents.jade',
		   { 
		     results_photos: results_photos,
		     state: false,
		     msg: msg}
	  );
};
	
function output_photos(res, results_photos, msg, tripUserID){
	res.render('showContents.jade',
		   { 
		     results_photos: results_photos,
		     state: true,
		     msg: msg}
	  );
};

function output_photos_others(res, results_photos, msg, tripUserID){
	res.render('othersShowContents.jade',
		   { 
		     results_photos: results_photos,
		     state: true,
		     msg: msg}
	  );
};

function output_photos_zero_others(res, results_photos, msg, tripUserID){
	res.render('othersShowContents.jade',
		   { 
		     results_photos: results_photos,
		     state: false,
		     msg: msg}
	  );
};









