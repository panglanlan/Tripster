var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");

exports.do_work = function(res, req){
	console.log("news feed do work");
	do_query(res, userID);	
};

function do_query(res, userID){
	oracle.connect(connectData, function(err, connection) {
	var res1 = res;	  
	if ( err ) {
	   	console.log(err);
	} else {
	var query="SELECT Users.USER_ID, Users.FULL_NAME, Users.AFFILIATION, Users.EMAIL, Users.PRIVACY AS USER_PRIVACY, Users.INTEREST, Trip.TRIP_NAME, Trip.TRIP_ID, Trip.EXPENSE, Trip.SCHEDULE, Trip.HOTEL, Trip.FEATURE, Trip.HOTEL_HYPERLINK, Trip.PRIVACY AS TRIP_PRIVACY FROM Users, Trip WHERE Users.USER_ID = Trip.USER_ID AND Trip.PRIVACY = 'public'";
		connection.execute(query, [], 
			function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query results:" + results[0].TRIP_NAME + " " + results[0].FULL_NAME);
		  	    	connection.close(); // done with the connection
		  	    	console.log("query user and trip information success");
		  	    	console.log("res in news feed:"+res1);
		  	    	renderNewsFeed(res1, results); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	
}

function renderNewsFeed(res, results){
	console.log("results"+results);
	res.render('news_feed.jade',
		{ title: "",
		  results: results}
	  );
}