var tripPage = require('./tripPage');
var addLocation = require('./add_location');

exports.do_work = function(req,res){
	console.log("enter pre-edittrip");
	query_trip_info(res,tripID,trip_userID);
	
	//editInformation(res,userID, req.body.full_name,req.body.email,req.body.PWD, req.body.affiliation,req.body.interest);
	//editInformation(res,userID, result.full_name,result.email,result.PWD, result.affiliation,result.interest);
};

exports.edit_trip = function(req,res){
	console.log("enter edit_trip "+req);
	console.log("tripID = " + tripID);
	editInformation(res,req.body.tripID,req.body.tripName,req.body.tripDest,req.body.locationType,req.body.locationLink,req.body.expense,req.body.schedule,req.body.hotel,req.body.hotel_link,req.body.feature,req.body.privacy);
};

var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
		var oracle =  require("oracle");
		var bcrypt = require('bcryptjs');
		
function renderEditpage(res,tripID, results) {
	console.log("edit_trip page");
	res.render('edit_trip',
			{
			title: tripID,
			results: results }
			);
		}	

var locationID = 0;
var originLocationID = 0;
function editInformation(res,newtripID,tripName,tripDest,locationType,locationLink, expense,schedule,hotel,hotel_link,feature,privacy) {
		console.log("editInformation");
		oracle.connect(connectData, function(err, connection) {
		    if(err){
		    	console.log(err);
		    }else{
		    	var query_location = "SELECT LOCATION_ID FROM LOCATIONS WHERE LOCATION_NAME = '" + tripDest + "'";
		    	connection.execute(query_location,
		    				[], 
			  			   function(err, results){
		    		if(err){
		    			console.log(err);
		    		}else{
		    			if(results[0]==null){
		    				console.log("new location");
		    				var query_location_id = "SELECT LOCATION_ID FROM LOCATIONS WHERE LOCATION_ID >= ANY(" +
		    						"SELECT LOCATION_ID FROM LOCATIONS)";
		    				connection.execute(query_location_id,
		    						[],
		    				function(err,results){
		    					if(err){
		    						console.log(err);
		    					}else{
		    						locationID = results[0] + 1;
		    	    				var add_location = "INSERT INTO LOCATIONS (LOCATION_ID,LOCATION_NAME,LOCATION_TYPE)" +
		    	    				"VALUES(" + locationID +",'" + tripDest + "','" + locationType + "')";
		    	    				connection.execute(add_location,
		    	    						[],
		    	    				function(err,results){
		    	    					if(err){
		    	    						console.log(err);
		    	    					}else{
		    	    						console.log("add new location success");
		    	    						console.log(results);
		    	    					}
		    	    				});
		    					}
		    				});//end execute query location id
		    			}
			    		else{
			    			locationID = results[0].LOCATION_ID;
			    			originLocationID = results[0].LOCATION_ID;
			    			console.log("update locations:"+locationID+" "+locationType+" "+tripDest);
			    			var update_locations = "UPDATE LOCATIONS SET LOCATION_TYPE='"+locationType+"',LOCATION_NAME='"+tripDest+"' WHERE LOCATION_ID='"+locationID+"'";
					    	connection.execute(update_locations,
				    				[], 
					  			   function(err, results){
				    		if(err){
				    			console.log(err);
				    		}else{
				    			console.log(results);
				    		}
			    				});//end execute query location id
			    		}
		    			editInformationHelper(res,newtripID,tripName,locationID,locationLink,expense,schedule,hotel,hotel_link,feature,privacy,originLocationID);
		    		}
		    	});
		    }
		  }); // end oracle.connect
	}

function editInformationHelper(res,newtripID,tripName,locationID,locationLink, expense,schedule,hotel,hotel_link,feature,privacy,originLocationID){
	  console.log("editInformationHelper");
	  oracle.connect(connectData, function(err, connection) { 
	    if ( err ) {
	    	console.log(err);
	    } else {
	  
	    	var query=
	    		"UPDATE TRIP SET TRIP_ID = '"+ newtripID +
	  			"', TRIP_NAME = '" + tripName + "', EXPENSE = '" + expense + "', SCHEDULE = '" + schedule + "', HOTEL = '"+ hotel + 	
	  			"', HOTEL_HYPERLINK = '" + hotel_link + "', FEATURE = '" + feature + "', PRIVACY = '" + privacy + "' WHERE USER_ID = '"
	  			+  trip_userID + "' AND TRIP_ID = '" + tripID + "'";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query Executed");
		  	    	console.log(results);
		  	    	connection.close(); // done with the connection
		  	    	console.log("query trip information success");
		  	    	updateAddLocation(res,trip_userID,newtripID,locationLink,locationID,originLocationID);
		  	    	//backtotripPage(res,newtripID); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

function query_trip_info(res, tripID,trip_userID) {
	  console.log("query_trip_info");
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
			 
	    	var query="SELECT L.LOCATION_NAME,L.LOCATION_TYPE,T.TRIP_NAME,T.TRIP_ID,T.EXPENSE,T.SCHEDULE,T.HOTEL,T.HOTEL_HYPERLINK,T.PRIVACY,T.USER_ID,T.FEATURE " +
			"FROM TRIP T, ADD_LOCATIONS A, LOCATIONS L WHERE T.TRIP_ID='" + tripID + "' AND T.USER_ID=A.USER_ID AND A.LOCATION_ID=L.LOCATION_ID AND T.USER_ID='" + trip_userID + "'";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query trip info Success");
		  	    	connection.close(); // done with the connection
		  	    	renderEditpage(res,results[0].TRIP_NAME,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function updateAddLocation(res,trip_userID,newtripID,locationLink,locationID,originLocationID){
	console.log("updateAddLocation");
	oracle.connect(connectData, function(err, connection) { 
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	//INSERT INTO ADD_LOCATIONS (USER_ID,TRIP_ID,HYPERLINK,LOCATION_ID) VALUES('"+trip_userID+"','"+newtripID+"','"+locationLink+"','"+locationID+"')";
	    	console.log("tripID:"+tripID);
	    	var query=//"SELECT * FROM ADD_LOCATIONS";
	    		"UPDATE ADD_LOCATIONS SET USER_ID = '"+trip_userID+"',TRIP_ID = "+newtripID+",HYPERLINK = '"+locationLink+
	    		        "',LOCATION_ID = "+locationID+" WHERE USER_ID = '"+trip_userID+"' AND TRIP_ID = "+
	    		        tripID+" AND LOCATION_ID = "+originLocationID;
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("update add locations success");
		  	    	console.log(results);
		  	    	connection.close(); // done with the connection
		  	    	//updateAddLocation(res,trip_userID,newtripID,locationID);
		  	    	backtotripPage(res,newtripID); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	//backtotripPage(res,newtripID);
}

function backtotripPage(res,req) {
	console.log("backtotripPage");
	//tripPage.do_work(res,req);
	tripID = req;
	tripPage.do_work_2(req,res);
}