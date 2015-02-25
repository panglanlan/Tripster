exports.do_work = function(req, res){
	console.log("tripcomment");
console.log(req.body.userIDcreator);
console.log(req.body.tripID);
show_contents(res, userID, req.body.tripID, req.body.userIDcreator);
};


var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var bcrypt = require('bcryptjs');


function show_contents(res, userID, tripID, userIDcreator){
	
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT * FROM RATE_COMMENT_TRIP WHERE TRIP_ID = '" + tripID +"' " +
	    			"AND USER_ID = '" + userIDcreator + "' ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if(results.length == 0){
		  	    		out_put_zero_comment(res, userID, tripID, userIDcreator);
		  	    	}
		  	    	else{
		  	    	
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("query trip information success");
		  	    	var msg = "see comments and ratings!";
		  	    	output_comments(res, results, msg); }
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect


	
function out_put_zero_comment(res, userID, tripID, userIDcreator){
		
		oracle.connect(connectData, function(err, connection) {
			  
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	
		    	var query="SELECT * FROM TRIP WHERE TRIP_ID = '" + 
		    	tripID +"' AND USER_ID = '" + userIDcreator + "' ";
			  	connection.execute(query, 
			  			   [], 
			  			   function(err,results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	

			  	    	//console.log("Query Executed")
			  	    	connection.close(); // done with the connection
			  	    	console.log("query trip information success");
			  	    	var msg = "its empty, try add more comments";
			  	    	output_comments_zero(res, results, msg); 
			  	    }
			
			  	}); // end connection.execute
			  	
		    };
		  }); // end oracle.connect
		
	}
function output_comments_zero(res, results_comments, msg){
	res.render('othersTripComments.jade',
		   { 
		     results_comments: results_comments,
		     msg: msg}
	  );
};
	
function output_comments(res, results_comments, msg){
	res.render('othersTripComments.jade',
		   { 
		     results_comments: results_comments,
		     msg: msg}
	  );
};

};