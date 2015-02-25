
var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
		var oracle =  require("oracle");


exports.do_work = function(req, res){
	//console.log();
	console.log("friends of "+ userID);
	//console.log("srcID in /tag "+srcID);
	show_friend_list(res,false, false);
};

function show_friend_list(res,fail, pending) {
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query="SELECT * FROM Friend WHERE Friend.followed_id = '" + userID + "' AND Friend.status = 'accept'";
			connection.execute(query, [],
					function(err, results) {
						if ( err ) {
							console.log(err);
						} else {
							connection.close(); // done with the connection
							if (fail == false){
								if(pending == false){
									console.log(results[0]);
									console.log("friends id "+ results[0].FOLLOWING_ID);
									renderFriendPage(res, results);
								}else{
									renderPending(res, results);
								}
							}else{
								
								renderFail(res,results);
							}
						}
		}); // end connection.execute
	}
	}); // end oracle.connect
	}

function renderFriendPage(res, results) {
	res.render('add_friend',
	{
		fail: fail = false,
		results: results
	}
);}

function renderFail(res,results) {
	res.render('add_friend',
	{
		results: results,
		fail: fail = true
	}
);}

function renderPending(res, results) {
	res.render('add_friend',
	{
		fail: fail = false,
		results: results,
		pending: true
	}
);}

exports.add_friend = function(req, res){
	console.log("friend id entered " + req.body.FRIEND_ID);
	checkID(res, req.body.friend_id);
};

function checkID(res, friend_id){
	console.log("check if friend id is valid, id:" + friend_id);
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
		var query="SELECT * FROM Users Where user_id='"+friend_id+"'";
		connection.execute(query,[],
			function(err,results) {
				if ( err ) {
					console.log(err);
				} else {
					if (results[0] == null )
					{
						console.log("Invalid friend_id")
						fail = true;
						show_friend_list(res,fail, false);
					}else{
						checkExist(res,friend_id);
					}
				}
		}); // end connection.execute
	}
	}); // end oracle.connect
	}

function checkExist(res,friend_id) {
	//var intPageNum;
	console.log("check if friend already exist, friend id entered "+ friend_id);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="SELECT following_id FROM Friend WHERE Friend.followed_id = '" + userID +
		"' and following_id ='"+ friend_id +"' AND status = 'accept'";
		connection.execute(query, [],
			function(err, results) {
				if ( err ) {
					console.log(err);
				} else {
					connection.close(); // done with the connection
					if (results[0] == null ){
						checkUpdate(res,friend_id);
					}else{
						console.log("Friend already exists");
						fail = true;
						show_friend_list(res,fail, false);
					}
				}
		}); // end connection.execute
	}
	}); // end oracle.connect
}

function checkUpdate(res,friend_id) {
	//var intPageNum;
	console.log("check if friend status need to be updated, friend id entered "+ friend_id);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="SELECT following_id FROM Friend WHERE Friend.followed_id = '" + userID +
		"' and following_id ='"+ friend_id +"' ";
		connection.execute(query, [],
			function(err, results) {
				if ( err ) {
					console.log(err);
				} else {
					connection.close(); // done with the connection
					if (results[0] == null ){
						insertData(res,friend_id);
					}else{
						updateData(res, friend_id);
					}
				}
		}); // end connection.execute
	}
	}); // end oracle.connect
}

function insertData(res,friend_id) {
	console.log(userID, friend_id);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="INSERT INTO Friend (following_id, followed_id, status) VALUES ('"+ friend_id + "', '" + userID + "', 'pending' ) ";
	connection.execute(query,[],
			function(err,results) {
				if ( err ) {
					console.log(err);
				} else {
					console.log("Query Executed");
					connection.close(); // done with the connection
					fail = false;
					console.log("Inserted Correctly");
					show_friend_list(res,fail,true);
				}
			}); // end connection.execute
		}
	}); // end oracle.connect
}

function updateData(res,friend_id) {
	console.log(userID, friend_id);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="UPDATE Friend SET following_id = '" + friend_id + "',followed_id = '" + userID + "',status = 'pending' WHERE following_id = '"+friend_id+"' AND followed_id = '"+ userID+"'";
		connection.execute(query,[],
			function(err,results) {
				if ( err ) {
					console.log(err);
				} else {
					console.log("Query Executed");
					connection.close(); // done with the connection
					fail = false;
					console.log("Inserted Correctly");
					show_friend_list(res,fail,true);
				}
			}); // end connection.execute
		}
	}); // end oracle.connect
}