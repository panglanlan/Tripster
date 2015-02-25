var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var bcrypt = require('bcryptjs');

exports.do_work = function(req, res){
	console.log("Query Success1111"+req.body.userID);
	show_user_info_other(res,req.body.userID);
	
};

function show_user_info_other(res,otherID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {

	    	var query="SELECT *  FROM Users WHERE user_id = '" +  otherID + 	"'  AND Users.PRIVACY='public' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if(results[0] == null){
		  	    		show_trip_info_otherHelper(res, otherID, results);
		  	    	}else{
		  	    		console.log("Query Success");
		  	    		//console.log(results);
		  	    		show_trip_info_other(res, otherID, results, true);
		  	    		connection.close(); // done with the connection
		  	    	}
		  	    }
		
		  	}); // end connection.execute		  	
	    }
	  }); // end oracle.connect
	}

function show_trip_info_otherHelper(res, otherID, results) {
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    }else {
	    	var query_friend = "SELECT * FROM USERS INNER JOIN FRIEND ON USERS.USER_ID=FRIEND.FOLLOWED_ID AND USERS.USER_ID='"+otherID+
	    	"' AND FOLLOWING_ID='"+userID+"'AND STATUS='accept' AND USERS.PRIVACY='sharedWithTripMembers'";
	    	connection.execute(query_friend, 
		  			   [], 
		  			   function(err, friend_result) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("show_trip_info_result:"+results);
		  	    	if(friend_result[0] == null){
		  	    		show_trip_info_other(res, otherID, results,false);
		  	    	}else{
		  	    		console.log("Query Success");
		  	    		
		  	    		show_trip_info_other(res, otherID, results, true);
		  	    		connection.close(); // done with the connection
		  	    	}
		  	    }
		
		  	}); // end connection.execute	
	    }
	});
}

function show_trip_info_other(res, otherID, results, userFlag){
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query_trip = "SELECT * FROM Trip INNER JOIN Users ON Users.USER_ID=Trip.USER_ID WHERE Users.PRIVACY='public' AND Trip.user_id = '" + otherID + "'";
	    	
		  	connection.execute(query_trip, 
		  			   [], 
		  			   function(err, results_trip) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query TRIP Success");
		  	    	console.log(results_trip);
		  	    	output_user_trip_other(res,otherID, results, results_trip, userFlag);
		  	    	connection.close(); // done with the connection
		  	    	
		  	    }
		
		  	}); // end connection.execute		  	
	    }
	  }); // end oracle.connect
	
}

function output_user_trip_other(res, user_id, results, results_trip, userFlag) {
	console.log(userFlag+"to others profile");
	
	//console.log(results[0].FULL_NAME);
	res.render('othersProfile.jade',
		   {
			 user_id: user_id,
		     results: results,
		     results_trip: results_trip,
		   	 userFlag: userFlag}
	  );
}






