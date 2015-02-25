
exports.do_work = function(req, res){
console.log("tripPage"+req.body.tripID+" "+userID);
show_trip(res,req.body.tripID,userID);//pass in trip id and trip user id
};

exports.do_work_2 = function(req,res){
	show_trip(res,req,trip_userID);
};

exports.do_work_3 = function(req,res){
console.log("tripPage"+ req.body.tripInfo);	
var tripInfo = req.body.tripInfo.split(",");
console.log("tripPage"+tripInfo[0]+" "+tripInfo[1]);
show_trip(res,tripInfo[0],tripInfo[1]);//pass in trip id and trip user id	
};

var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
		var oracle =  require("oracle");
		var bcrypt = require('bcryptjs');



function show_trip(res,tripID, tripUserID){
	console.log("tripID"+tripID);
	console.log("tripUserID"+ tripUserID);
	
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT L.LOCATION_NAME,L.LOCATION_TYPE,A.HYPERLINK,T.TRIP_NAME,T.TRIP_ID,T.EXPENSE,T.SCHEDULE,T.HOTEL,T.HOTEL_HYPERLINK,T.PRIVACY,T.USER_ID,T.FEATURE " +
			"FROM TRIP T, ADD_LOCATIONS A, LOCATIONS L WHERE T.TRIP_ID='" + tripID + "' AND T.USER_ID=A.USER_ID AND A.LOCATION_ID=L.LOCATION_ID AND T.USER_ID='" + tripUserID + "'";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("query trip information success");
		  	    	console.log("!!!!!22222"+ results+ "@@@@@");
		  	    	if(results[0]==null) {
		  	    		building_trip(res,tripID,tripUserID);
		  	    	}else {
		  	    		show_album(res,tripID, tripUserID, results[0]); 
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect

}	

function building_trip(res,tripID,tripUserID) {
	res.render('trip_constructing.jade');

}
	
	function show_album(res, tripID, tripUserID, results){
		oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var query_album = "SELECT * FROM ADDALBUM WHERE user_id = '" + tripUserID + 
		    	"' AND TRIP_ID = '" + tripID + "'";
		    	
			  	connection.execute(query_album, 
			  			   [], 
			  			   function(err, results_album) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	console.log("Query Success");
			  	    	console.log(results_album);
			  	        global.tripID = tripID;
			  	        console.log("!!!!"+ results + "!!!!!!!!!!!!!!!!!");
			  	        global.trip_userID = results.USER_ID;
			  	    	output_trip_album(res, tripUserID, results, results_album);
			  	    	connection.close(); // done with the connection			  	    	
			  	    }
			
			  	}); // end connection.execute		  	
		    };
		  }); // end oracle.connect
		
	}

function output_trip_album(res, tripUserID, results, results_album) {
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
			  	    		view_others_trip(res,results,results_album);
			  	    	}else{
			  	    		console.log("test1");
			  	    		view_trip(res,results,results_album);
			  	    	}
			  	    }
			
			  	}); // end connection.execute		  	
		    };
		  }); // end oracle.connect
	}else{
  		view_trip(res,results,results_album);
	}
}

function view_others_trip(res,results,results_album){
	res.render('othersTrip.jade',
	        { tripID: results.TRIP_ID,
		     tripName: results.TRIP_NAME,
		     tripDest: results.LOCATION_NAME,
		     locationType:results.LOCATION_TYPE,
		     locationLink:results.HYPERLINK,
		     expense: results.EXPENSE,
		     schedule: results.SCHEDULE,
		     hotel: results.HOTEL,
		     hotel_hyperlink: results.HOTEL_HYPERLINK,
		     privacy: results.PRIVACY,
		     feature: results.FEATURE,
		     results: results,
		     msg:"Trip Info",
		     trip_userID: results.USER_ID,
		     current_userID: userID,
		     results_album: results_album});
}
function view_trip(res,results,results_album){
	console.log("view_trip_locationtype locationname"+results.LOCATION_TYPE+" "+results.LOCATION_NAME);
	res.render('trip.jade',
			   { tripID: results.TRIP_ID,
			     tripName: results.TRIP_NAME,
			     tripDest: results.LOCATION_NAME,
			     locationType:results.LOCATION_TYPE,
			     locationLink:results.HYPERLINK,
			     expense: results.EXPENSE,
			     schedule: results.SCHEDULE,
			     hotel: results.HOTEL,
			     hotel_hyperlink: results.HOTEL_HYPERLINK,
			     privacy: results.PRIVACY,
			     feature: results.FEATURE,
			     results: results,
			     msg:"Trip Info",
			     trip_userID: results.USER_ID,
			     current_userID: userID,
			     results_album: results_album}
	);			
}
