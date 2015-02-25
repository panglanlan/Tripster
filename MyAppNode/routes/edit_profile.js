var userprofile = require('./userprofile');


exports.do_work = function(req,res){
	console.log("enter pre-editprofile");
	 query_user_info(res,userID);
	
	//editInformation(res,userID, req.body.full_name,req.body.email,req.body.PWD, req.body.affiliation,req.body.interest);
	//editInformation(res,userID, result.full_name,result.email,result.PWD, result.affiliation,result.interest);
};

exports.edit_profile = function(req,res){
	console.log("enter edit_profile");
	console.log("userID = " + userID);
	console.log("req" + req.body);
	console.log("full_name = " + req.body.full_name);
	editInformation(res,userID, req.body.full_name,req.body.email,req.body.affiliation,req.body.interest,req.body.privacy);
};

var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
		var oracle =  require("oracle");
		var bcrypt = require('bcryptjs');
		
function renderEditpage(res,name, results) {
	res.render('edit_profile',
			{
			title: name,
			results: results }
			);
		}	


function 	editInformation(res,userID,fullname,email,affiliation,interest,privacy) {
	console.log(fullname,email,affiliation,interest);
	console.log(userID);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="UPDATE Users SET  email = '"+ email +
	  			"', affiliation = '" + affiliation + "', privacy = '" + privacy + "', interest = '" + interest + "', full_name = '"+ fullname +
	  	
	  			"' " +" WHERE   USER_ID=  '" +  userID + "' ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("query user information success");
		  	    	backtoprofile(res,userID); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

function query_user_info(res, userID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {

	    	var query="SELECT *  FROM USERS WHERE USER_ID = '" +  userID + 
	  			"'  ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query userinfo Success");
		  	    	console.log(results);
		  	    	connection.close(); // done with the connection
		  	    	
		  	    	renderEditpage(res,results[0].FULL_NAME,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}


function backtoprofile(res,req) {
	userprofile.do_work(req,res);
	//res.render('userprofile', {fail:fail});
}