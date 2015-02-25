var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
//var tripPage = require('./tripPage');
var userprofile = require('./userprofile');

var tripPage = require('./tripPage');
//var photoComments = require('./photoComments');

exports.do_work = function(req, res){
	//add_trip_info(res, req);
	console.log(req.body.tripID);
	console.log(req.body.userIDcreator);
	console.log(req.body.comment);
	console.log(req.body.rate);
	updateComments(res, userID, 
			req.body.tripID, req.body.userIDcreator, req.body.comment, req.body.rate
		  );
};

function updateComments(res, userID, tripID, userIDcreator, comment, rate){
	console.log(userID, tripID, userIDcreator, comment, rate);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var queryUser = "SELECT * FROM RATE_COMMENT_TRIP  WHERE USER_ID = '"+userIDcreator+"' AND TRIP_ID = '"+tripID+"' AND USER_ID_RATER = '"+userID+"' "; 
	    	
		  	connection.execute(queryUser, 
		  			   [], 
		  			   function(err,results_user) {
		  	    if ( err ) {
		  	    //	updateComment(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
		  	    		
		  	    	console.log(err);
		  	    } else {
		  	    	if (results_user.length == 0){
		  	    		addComments(res, userID, tripID, userIDcreator, comment, rate);
		  	    		console.log("add new comments");}
		  	    		else{
		  	    			
		  	    			update(res, userID, tripID, userIDcreator, comment, rate);
		  	    		}
		  	    	}
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,results); 
		  	   
		
		  	}); // end connection.execute
	    };
	  }); // end oracle.connect
};

function update(res, userID, tripID, userIDcreator, comment, rate){
	console.log(res, userID, tripID, userIDcreator, comment, rate);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="UPDATE RATE_COMMENT_TRIP SET COMMENTS = '"+ comment+"', RATING = '"+rate+ "'  WHERE USER_ID = '"+userIDcreator+"' AND TRIP_ID = '"+tripID+"' AND USER_ID_RATER = '"+ userID+"' " ;
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    //	updateComment(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
		  	    		
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,userID); 
		  	    	var msg = "Successfully updated new comment and rate!";
		  	    	show_trip(res,tripID,msg);
		  	    }
		
		  	}); // end connection.execute
	    };
	  }); // end oracle.connect
}

function addComments(res, userID, tripID, userIDcreator, comment, rate) {
	console.log(userID, tripID, userIDcreator, comment, rate);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO RATE_COMMENT_TRIP VALUES('"+ userIDcreator +"' , '"+ userID +"' , '" + tripID +"', '" + rate +"', " +
	    			"'" + comment +"')";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    //	updateComment(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
		  	    		
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,userID); 
		  	    	var msg = "Successfully updated your last comment and rate!";
		  	    	show_trip(res,tripID,msg);
		  	    }
		
		  	}); // end connection.execute
	    };
	  }); // end oracle.connect
};


//updateComment(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate){
//	
//}


function show_trip(res,tripID, msg){
	
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
		  	    	
		  	    	show_album(res,tripID, results[0], msg); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect



	function show_album(res, tripID, results, msg){
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
			  	    	
			  	    	output_trip_album(res, results, results_album, msg);
			  	    	connection.close(); // done with the connection
			  	    	
			  	    }
			
			  	}); // end connection.execute		  	
		    };
		  }); // end oracle.connect
		
	}
	
	

function output_trip_album(res, results, results_album, msg) {
	res.render('othersTrip.jade',
		   { tripID: results.TRIP_ID,
		     tripName: results.TRIP_NAME,
		     expense: results.EXPENSE,
		     schedule: results.SCHEDULE,
		     hotel: results.HOTEL,
		     hotel_hyperlink: results.HOTEL_HYPERLINK,
		     privacy: results.PRIVACY,
		     feature: results.FEATURE,
		     results: results,
		     msg: msg,
		     results_album: results_album}
	  );
};
};

//function backtoprofile(req,res) {
//	userprofile.do_work(req,res);

//};


