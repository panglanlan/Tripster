var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
var oracle =  require("oracle");
var new_id = 0;

exports.do_work = function(tripDest,locationType,res){
	db_query(res,tripDest,locationType);
};

function db_query(res,location,location_type){
	oracle.connect(connectData, function(err, connection) {
	    if(err){
	    	console.log(err);
	    }else{
	    	var query_location = "SELECT LOCATION_ID FROM LOCATIONS WHERE LOCATION_NAME = '" + location + "'";
	    	connection.execute(query_location,
	    				[], 
		  			   function(err, results){
	    		if(err){
	    			console.log(err);
	    		}else{
	    			if(results[0]==null){
	    				var query_location_id = "SELECT LOCATION_ID FROM LOCATIONS WHERE LOCATION_ID >= ANY(" +
	    						"SELECT LOCATION_ID FROM LOCATIONS)";
	    				connection.execute(query_location_id,
	    						[],
	    				function(err,results){
	    					if(err){
	    						console.log(err);
	    					}else{
	    						new_id = results[0] + 1;
	    	    				var add_location = "INSERT INTO LOCATIONS VALUE(LOCATION_ID,LOCATION_NAME,LOCATION_TYPE)" +
	    	    				"VALUE(" + new_id +",'" + location + "','" + location_type + "')";
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
	    		}
	    	});
	    }
	  }); // end oracle.connect
}