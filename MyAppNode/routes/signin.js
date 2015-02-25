// Connect string to Oracle
var connectData = { 
  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
  "user": "oracle", 
  "password": "12345678", 
  "database": "ORCL" };
var oracle =  require("oracle");
var bcrypt = require('bcrypt');
var userprofile = require('./userprofile');
var news_feed = require('./news_feed');

function query_db(res,userID,password) {
	userID = userID.replace(/\s/g, '');
	password = password.replace(/\s/g, '');
	
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
			
	    	var query="SELECT USER_ID, PWD FROM USERS WHERE USER_ID = '" +  userID + 
  			"' AND ROWNUM = 1 ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
					console.log("Query Successful");
					//console.log(results);
					//Updating the global variable
					
					
					if (results[0] == null )
						{
						console.log("No User Found");
						fail = true;
						results_fail(res,fail);
						}
					else
						{
						if(results[0].PWD == null){
							reset_password(res,userID);
						}
						var res1 = res;
						console.log(results);
				    	bcrypt.compare(password, results[0].PWD, function(err, res) {
				    	    console.log(res);
				    		 if (res == false)
							 {
				    
								console.log("User Creditials Invalid");
								fail = true;
								results_fail(res1,fail);
							 }
				    		 else
				    		{	 
				    			 fail = false;
				    			 console.log("Login Sucess");
				    			 global.userID = userID;
				    			 login_success(res1,results[0].USER_ID);

						//show_user_info(res1,userID);
						//query_db_recommendation(res1,userID); 
				    		}
						

				    	});
				    	
				    	
				    	
						}
					
					// If result is found, autheneticate,
					// Store userName as userName. 
					//
		  	    	//output_photos(res, searchTags, PageNum,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}


function results_fail(res,fail) {
	res.render('login',
		  {
	      fail: fail

			}	
	
	  );
}
function login_success(res,req) {
    news_feed.do_work(res,req);
    //res.render('userprofile', {fail:fail});
}

function reset_password(res,userID) {
	res.render('reset');
}

function resetPWD(res, password) {
	console.log(password);
	password = password.replace(/\s/g, '');
	
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
			
            
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
	    	var query="UPDATE USERS SET PWD='" + hash+"' WHERE USERS.USER_ID = '"+ userID +"'";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
					console.log("Query Successful");
					console.log(results);
					//Updating the global variable
					console.log("Reset Success");
					fail = false;
					reset_success(res,fail);
					// If result is found, autheneticate,
					// Store userName as userName. 
					//
		  	    	//output_photos(res, searchTags, PageNum,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

function reset_success(res,fail){
	res.render('index');
}

exports.do_work = function(req, res){
	query_db(res,req.body.userID,req.body.password);
};

exports.do_work_2 = function(req,res){
	login_success(res,userID);
}
exports.reset = function(req, res){
	console.log(req);
	resetPWD(res,req.body.password);
};