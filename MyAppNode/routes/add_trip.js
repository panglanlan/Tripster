var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var userprofile = require('./userprofile');

exports.do_work = function(req, res){
	//add_trip_info(res, req);
	res.render('add_trip.jade',
			   { userID: "h",
			     results: "results"}
		  );
};

exports.add_trip = function(req, res){
	console.log("enter add_trip");
	console.log("userID = " + userID);
	console.log("trip_name = " + req.body.trip_name);
	console.log("privacy = " + req.body.privacy);
	//tripInformation(res, userID, req.body.trip_name, req.body.trip_id, req.body.schedule, req.body.hotel, req.body.hotel_url, req.body.expense, req.body.feature, req.body.privacy);
	chooseTripID(res, userID, req.body.trip_name, req.body.schedule, req.body.hotel, req.body.hotel_url,
			req.body.expense, req.body.feature, req.body.privacy);
};
function chooseTripID(res, userID, trip_name, schedule, hotel, hotel_url, expense, feature, privacy) {
	console.log(userID, trip_name,  schedule, hotel, hotel_url, expense, feature, privacy);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT MAX(TRIP_ID)  AS TRIP_ID FROM Trip";
	    	
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
		  	    	tripInformation(res, userID, trip_name, results[0].TRIP_ID + 1, schedule, hotel, hotel_url, expense, feature, privacy);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
};


function tripInformation(res, userID, trip_name, trip_id, schedule, hotel, hotel_url, expense, feature, privacy) {
	console.log(userID, trip_name, trip_id, schedule, hotel, hotel_url, expense, feature, privacy);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO Trip VALUES('"+ trip_name +"' , '"+ trip_id +"', '" + expense +"', '" + schedule +"', '" + hotel +"', '" + hotel_url +"', '" + privacy +"', '" + userID +"', '"+ feature +"')";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	backtoprofile(userID,res); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
};

function backtoprofile(userID, res) {
	userprofile.do_work(userID, res);
	//res.render('userprofile', {fail:fail});
}


