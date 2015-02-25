// Connect string to Oracle
var connectData = { 
  "hostname": "cis5502.cx19ekvm2ckb.us-east-1.rds.amazonaws.com", 
  "user": "oracle", 
  "password": "12345678", 
  "database": "OCRL" };
var oracle =  require("oracle");
var bcrypt = require('bcryptjs');
/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM actors WHERE last_name='" + name + 
	  			"' AND rownum <= 10", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_actors(res, name, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_actors(res,name,results) {
	res.render('actor.jade',
		   { title: "Actors with last name " + name,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.name);
};
