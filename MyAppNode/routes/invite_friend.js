
var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
		var oracle =  require("oracle");



exports.do_work = function(req, res){
	console.log("enter invite_friend");
	console.log(req.body.tripID);
	show_friend_list(res,req.body.tripID,false, false);
	
};

exports.do_add_query = function(req, res){
	console.log("enter invite_friend_add query");
	var vals=req.body.friendID.split("|");
	console.log(req.body.friendID);
	var friendID=vals[0];
	var tripID=vals[1];
	console.log(tripID);
	checkExist(res,tripID,friendID);
	
};


function checkUpdate(res,tripID, friend_id) {
	//var intPageNum;
	console.log("check if friend status need to be updated, friend id entered "+ friend_id);
	console.log("trip_id"+tripID);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="SELECT * FROM Invite WHERE user_id_invited = '" + friend_id +
		"' and user_id = '"+ userID +"'AND trip_id = '"+ tripID +"'";
		connection.execute(query, [],
			function(err, results) {
				if ( err ) {
					console.log(err);
				} else {
					connection.close(); // done with the connection
					if (results[0] == null ){
						console.log("insert");
						insertData(res,tripID,friend_id);
					}else{
						console.log("update");
						updateData(res, tripID, friend_id);
					}
				}
		}); // end connection.execute
	}
	}); // end oracle.connect
}

function updateData(res,tripID, friend_id) {
	console.log(userID, friend_id);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="UPDATE Invite SET status = 'pending' WHERE user_id_invited = '"+friend_id+"' AND trip_id = '"+tripID+"' AND user_id = '"+ userID+"'";
		connection.execute(query,[],
			function(err,results) {
				if ( err ) {
					console.log(err);
				} else {
					console.log("Query Executed");
					connection.close(); // done with the connection
					fail = false;
					console.log("Inserted Correctly");
					show_friend_list(res,tripID,fail,true);
				}
			}); // end connection.execute
		}
	}); // end oracle.connect
}



function checkExist(res,tripID,friend_id) {
	//var intPageNum;
	console.log("check if friend in request is already exist and in accept status, friend id entered "+ friend_id);
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="SELECT * FROM Invite WHERE user_id = '" + userID +
		"' and user_id_invited ='"+ friend_id +"' and trip_id ='"+ tripID +"' AND status = 'accepted'";
		connection.execute(query, [],
			function(err, results) {
				if ( err ) {
					console.log(err);
				} else {
					connection.close(); // done with the connection
					if (results[0] == null ){
						checkUpdate(res,tripID, friend_id);
					}else{
						console.log("Friend in trip already exists");
						fail = true;
						show_friend_list(res,tripID,fail, false);
					}
				}
		}); // end connection.execute
	}
	}); // end oracle.connect
}


function insertData(res,tripID, friend_id) {
	console.log(userID, friend_id);
	console.log(tripID+"!!!!!");
	oracle.connect(connectData, function(err, connection) {
	if ( err ) {
		console.log(err);
	} else {
		var query="INSERT INTO Invite (user_id, user_id_invited, trip_ID, status) VALUES ('"+ userID + "', '" + friend_id +"', '" + tripID + "', 'pending' ) ";
	connection.execute(query,[],
			function(err,results) {
				if ( err ) {
					console.log(err);
				} else {
					console.log("Query Executed");
					connection.close(); // done with the connection
					fail = false;
					console.log("Inserted Correctly");
					show_friend_list(res,tripID,fail,true);
				}
			}); // end connection.execute
		}
	}); // end oracle.connect
}

function show_friend_list(res, tripID,fail,pending) {
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
									renderFriendPage(res, results,tripID);
								}else{
									renderPending(res, results,tripID);
								}
							}else{
								
								renderFail(res,results,tripID);
							}
						}
		}); // end connection.execute
	}
	}); // end oracle.connect
	}
function renderFail(res,results, tripID) {
	res.render('invite_friend',
	{
		results: results,
		fail: fail = true,
		tripID: tripID
	}
);}


function renderFriendPage(res, results, tripID) {
	res.render('invite_friend',
	{
		fail: fail = false,
		results: results,
		tripID: tripID
	}
);}


function renderPending(res, results, tripID) {
	res.render('invite_friend',
	{
		fail: fail = false,
		results: results,
		tripID: tripID,
		pending: true
	}
);}