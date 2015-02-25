var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
//var tripPage = require('./tripPage');
var userprofile = require('./userprofile');
//var photoComments = require('./photoComments');

exports.do_work = function(req, res){
	//add_trip_info(res, req);
	console.log(req.body.tripID);
	console.log(req.body.comment);
	console.log(req.body.rate);
	updateComments(res, userID, req.body.albumID, req.body.objectID, req.body.objectSource,
			req.body.tripID, req.body.userIDcreator, req.body.comment, req.body.rate
		  );
};

function updateComments(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate){
	console.log(userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var queryUser = "SELECT * FROM RATE_COMMENT_OBJECT  WHERE USER_ID_CREATOR = '"+userIDcreator+"' AND ALBUM_ID = '"+albumID+"' AND OBJECT_ID = '"+objectID+"' AND OBJECT_SOURCE = '"+objectSource+"' AND USER_ID_Rater = '"+userID+"' "; 
	    	
		  	connection.execute(queryUser, 
		  			   [], 
		  			   function(err,results_user) {
		  	    if ( err ) {
		  	    //	updateComment(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
		  	    		
		  	    	console.log(err);
		  	    } else {
		  	    	if (results_user.length == 0){
		  	    		addComments(res, userID, albumID, objectID, objectSource,tripID, userIDcreator, comment, rate);
		  	    		console.log("add new comments");}
		  	    		else{
		  	    			
		  	    			update(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
		  	    		}
		  	    	}
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	//backtoprofile(res,results); 
		  	   
		
		  	}); // end connection.execute
	    };
	  }); // end oracle.connect
};

function update(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate){
	console.log(userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="UPDATE RATE_COMMENT_OBJECT SET COMMENTS = '"+ comment+"', RATING = '"+rate+ "'  WHERE USER_ID_CREATOR = '"+userIDcreator+"' AND ALBUM_ID = '"+albumID+"' AND OBJECT_ID = '"+objectID+"' AND OBJECT_SOURCE = '"+objectSource+"' AND USER_ID_RATER = '"+userID+"'";
	    	
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
		  	    	show_contents(res, userID, tripID, albumID, objectSource, userIDcreator, objectID);
		  	    }
		
		  	}); // end connection.execute
	    };
	  }); // end oracle.connect
}

function addComments(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate) {
	console.log(userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate);
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO RATE_COMMENT_OBJECT VALUES('"+ userIDcreator +"' , '"+ albumID +"' , '" + objectID +"', '" + objectSource +"', " +
	    			"'" + rate +"'," +
	    							" '" + comment +"', '"+ tripID +"', '"+ userIDcreator +"', '"+ userID +"')";
	    	
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
		  	    	show_contents(res, userID, tripID, albumID, objectSource, userIDcreator, objectID);
		  	    }
		
		  	}); // end connection.execute
	    };
	  }); // end oracle.connect
};

//updateComment(res, userID, albumID, objectID, objectSource, tripID, userIDcreator, comment, rate){
//	
//}


//function backtoprofile(res,req) {
//	userprofile.do_work(res,req);

//};
function show_contents(res, userID, tripID, albumID, objectSource, userIDcreator, objectID){
	
	oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT * FROM RATE_COMMENT_OBJECT WHERE ALBUM_ID = '" + albumID +"' " +
	    			"AND TRIP_ID = '" + tripID + "' AND USER_ID_CREATOR = '" + userIDcreator +"' AND OBJECT_SOURCE = '" + objectSource+"' AND OBJECT_ID = '" + objectID+"'";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if(results.length == 0){
		  	    		out_put_zero_comment(res, userID, tripID, albumID, objectSource, userIDcreator, objectID);
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


	
function out_put_zero_comment(res, userID, tripID, albumID, objectSource, userIDcreator, objectID){
		
		oracle.connect(connectData, function(err, connection) {
			  
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	
		    	var query="SELECT * FROM OBJECTS WHERE OBJECT_ID = '" + 
		    	objectID +"' AND TRIP_ID = '" + tripID + "' AND OBJECT_SOURCE = '" + objectSource+"' AND USER_ID_CREATOR = '"+ userIDcreator+"' AND ALBUM_ID = '" + albumID +"' AND OBJECT_ID = '"+objectID+"'";
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
	res.render('photoComments.jade',
		   { 
		     results_comments: results_comments,
		     msg: msg}
	  );
};
	
function output_comments(res, results_comments, msg){
	res.render('photoComments.jade',
		   { 
		     results_comments: results_comments,
		     msg: msg}
	  );
};

};


