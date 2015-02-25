exports.do_work = function(req, res){
	console.log("Query Success1111");
	show_user_info(res,userID);
	
};


var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var bcrypt = require('bcryptjs');

function show_user_info(res,userID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {

	    	var query="SELECT *  FROM Users WHERE user_id = '" +  userID + 	"'  ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log("Query Success");
		  	    	console.log("userID:" + userID);
		  	    	show_trip_info(res, userID, results);

		  	    	
		  	    }
		
		  	}); // end connection.execute		  	
	    }
	  }); // end oracle.connect
	}

function show_trip_info(res, userID, results){
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query_trip = "SELECT * FROM Trip WHERE user_id = '" + userID + "'";
	    	
		  	connection.execute(query_trip, 
		  			   [], 
		  			   function(err, results_trip) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query Success");
		  	    	console.log(results[0]);
		  	    	output_user_trip(res,results[0].USER_ID, results[0].FULL_NAME, results, results_trip);
		  	    	connection.close(); // done with the connection
		  	    	
		  	    }
		
		  	}); // end connection.execute		  	
	    }
	  }); // end oracle.connect
	
}

function output_user_trip(res, user_id, name, results, results_trip) {
	res.render('userprofile.jade',
		   { title: name,
			 user_id: user_id,
		     results: results,
		     results_trip: results_trip}
	  );
}








