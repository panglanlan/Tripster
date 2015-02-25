
var connectData = { 
		  "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com", 
		  "user": "oracle", 
		  "password": "12345678", 
		  "database": "ORCL" };
		var oracle =  require("oracle");


exports.do_work = function(req, res){
	//console.log();
	console.log("messages of "+ userID);
	getFriendRequests(res, userID);	
	
};

function getFriendRequests(res, userID){
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query="SELECT * FROM Friend WHERE Friend.following_id = '" + userID + "' AND Friend.status = 'pending'";
			connection.execute(query, [],
					function(err, results_friend) {
						if ( err ) {
							console.log(err);
						} else {
							connection.close(); // done with the connection
							if (results_friend[0] != null){
								console.log("have friend requests");
								console.log("number of friend requests:", results_friend.length);
								console.log(results_friend[0].FOLLOWED_ID);
								getTripInvites(res, userID, results_friend, true);
								//renderMessage(res, userID, results_friend, true);
							}else{
								console.log("no friend requests");
								getTripInvites(res, userID, results_friend, false);
								//renderMessage(res, userID, results_friend, false);
							}
						}
		}); // end connection.execute
	}
	}); // end oracle.connect
}

function getTripInvites(res, userID, results_friend, friendFlag){
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query="SELECT * FROM Invite WHERE Invite.user_id_invited = '" + userID + "' AND Invite.status = 'pending'";
			connection.execute(query, [],
					function(err, results_trip) {
						if ( err ) {
							console.log(err);
						} else {
							console.log(results_trip);
							connection.close(); // done with the connection
							if (results_trip[0] != null){
								console.log("have trip invitations");
								console.log("USER ID: "+ results_trip[0].USER_ID + " TRIP ID:" + results_trip[0].TRIP_ID );
								renderMessagePage(res, userID, results_friend, friendFlag, results_trip, true);
							}else{
								console.log("no trip invitations");
								renderMessagePage(res, userID, results_friend, friendFlag, results_trip, false);
							}
						}
		}); // end connection.execute
	}
	}); // end oracle.connect
}


function renderMessagePage(res, userID, results_friend, friendFlag, results_trip, tripFlag){
	res.render('message',
			{
				userID: userID,
				results_friend: results_friend,
				friendFlag: friendFlag,
				results_trip: results_trip,
				tripFlag: tripFlag
			}
		);}


function renderMessage(res, userID, results_friend, friendFlag){
	res.render('message',
			{
				userID: userID,
				results_friend: results_friend,
				friendFlag: friendFlag,
			}
		);}

exports.accept_friend = function(req, res){
	//console.log();
	console.log("friend request from "+ req.body.acceptFriendId + " was accepted.");
	acceptFriendRequests(res, req.body.acceptFriendId);	
	
};

exports.deny_friend = function(req, res){
	//console.log();
	console.log("friend request from "+ req.body.denyFriendId + " was denied.");
	denyFriendRequests(res, req.body.denyFriendId);	
	
};

function acceptFriendRequests(res, acceptFriendId){
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query_update = "UPDATE Friend SET status = 'accept' WHERE following_id = '"+userID+"' AND followed_id = '"+ acceptFriendId+"'";
			var query_insert = "INSERT INTO Friend (following_id, followed_id, status) VALUES ('"+acceptFriendId + "', '" + userID + "', 'accept' ) ";
			var query_friend ="SELECT * FROM Friend WHERE Friend.following_id = '" + userID + "' AND Friend.status = 'pending'";
			var query_trip = "SELECT * FROM Invite WHERE Invite.user_id_invited = '" + userID + "' AND Invite.status = 'pending'";
			connection.execute(query_update, [],
				function(err, results) {
					if ( err ) {
						console.log(err);
					} else {
						//connection.close(); // done with the connection
						console.log("friend table updated");	
						connection.execute(query_insert, [],
							function(err, results) {
								if ( err ) {
									console.log(err);
								} else {
									//connection.close(); // done with the connection
									console.log("friend table inserted");	
									connection.execute(query_friend, [],
											function(err, results_friend) {
												if ( err ) {
													console.log(err);
												} else {
													if (results_friend[0] != null){
														
													
													connection.execute(query_trip, [],
															function(err, results_trip) {
																if ( err ) {
																	console.log(err);
																} else {
																	if(results_trip[0] != null){
																		connection.close(); // done with the connection
																		console.log("query friend again");
																		renderMessagePage(res, userID, results_friend, true, results_trip, true);
																	}else{
																		connection.close(); // done with the connection
																		console.log("query friend again");
																		renderMessagePage(res, userID, results_friend, true, results_trip, false);
																	}
																}
													}); // end connection.execute	
													}else{
														connection.execute(query_trip, [],
																function(err, results_trip) {
																	if ( err ) {
																		console.log(err);
																	} else {
																		if(results_trip[0] != null){
																			connection.close(); // done with the connection
																			console.log("query friend again");
																			renderMessagePage(res, userID, results_friend, false, results_trip, true);
																		}else{
																			connection.close(); // done with the connection
																			console.log("query friend again");
																			renderMessagePage(res, userID, results_friend, false, results_trip, false);
																		}
																	}
														}); // end connection.execute	
													}
												}
									}); // end connection.execute	
								}
						}); // end connection.execute
					}
			}); // end connection.execute
			
					
	}
	}); // end oracle.connect
}



function denyFriendRequests(res, denyFriendId){
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query_update = "UPDATE Friend SET status = 'deny' WHERE following_id = '"+userID+"' AND followed_id = '"+ denyFriendId+"'";
			var query_friend ="SELECT * FROM Friend WHERE Friend.following_id = '" + userID + "' AND Friend.status = 'pending'";
			var query_trip = "SELECT * FROM Invite WHERE Invite.user_id_invited = '" + userID + "' AND Invite.status = 'pending'";
			connection.execute(query_update, [],
				function(err, results) {
					if ( err ) {
						console.log(err);
					} else {
						//connection.close(); // done with the connection
						console.log("friend table updated");	
						connection.execute(query_friend, [],
							function(err, results_friend) {
								if ( err ) {
									console.log(err);
								} else {
									if(results_friend[0] != null){
										//connection.close(); // done with the connection
										console.log("friend table query again");
										connection.execute(query_trip, [],
												function(err, results_trip) {
													if ( err ) {
														console.log(err);
													} else {
														if(results_trip[0] != null){
															connection.close(); // done with the connection
															console.log("friend table query again");
															
															renderMessagePage(res, userID, results_friend, true, results_trip, true);
														}else{
															renderMessagePage(res, userID, results_friend, true, results_trip, false);
														}
													}
											}); // end connection.execute	
										
									}else{
										//connection.close(); // done with the connection
										console.log("friend table query again");
										connection.execute(query_trip, [],
												function(err, results_trip) {
													if ( err ) {
														console.log(err);
													} else {
														if(results_trip[0] != null){
															//connection.close(); // done with the connection
															console.log("friend table query again");
															
															renderMessagePage(res, userID, results_friend, false, results_trip, true);
														}else{
															renderMessagePage(res, userID, results_friend, false, results_trip, false);
														}
													}
											}); // end connection.execute	
									}
								}
						}); // end connection.execute	
					}
			}); // end connection.execute
			
					
	}
	}); // end oracle.connect
}

exports.accept_trip = function(req, res){
	//console.log();
	var vals = req.body.acceptTripId.split("|");
	console.log(req.body.acceptTripId);
	var user_inviting = vals[0];
	var trip_id = vals[1];
	console.log(trip_id);
	console.log("trip invitation from "+ user_inviting + " was accepted.");
	acceptTripInvites(res, user_inviting, trip_id);	
	
};

exports.deny_trip = function(req, res){
	//console.log();
	var vals = req.body.denyTripId.split("|");
	console.log(req.body.denyTripId);
	var user_inviting = vals[0];
	var trip_id = vals[1];
	console.log(trip_id);
	console.log("friend request from "+ user_inviting + " was denied.");
	denyTripInvites(res, user_inviting, trip_id);	
	
};

function acceptTripInvites(res, user_inviting, trip_id){
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query_update = "UPDATE Invite SET status = 'accepted' WHERE USER_ID_INVITED = '"+userID+"' AND USER_ID = '"+ user_inviting+"' AND TRIP_ID = '" + trip_id + "'";
			var query_friend ="SELECT * FROM Friend WHERE Friend.following_id = '" + userID + "' AND Friend.status = 'pending'";
			var query_trip = "SELECT * FROM Invite WHERE Invite.user_id_invited = '" + userID + "' AND Invite.status = 'pending'";
			connection.execute(query_update, [],
				function(err, results) {
					if ( err ) {
						console.log(err);
					} else {
						//connection.close(); // done with the connection
						console.log("friend table updated");	
						connection.execute(query_friend, [],
											function(err, results_friend) {
												if ( err ) {
													console.log(err);
												} else {
													if (results_friend[0] != null){
														
													
													connection.execute(query_trip, [],
															function(err, results_trip) {
																if ( err ) {
																	console.log(err);
																} else {
																	if(results_trip[0] != null){
																		connection.close(); // done with the connection
																		console.log("query friend again");
																		renderMessagePage(res, userID, results_friend, true, results_trip, true);
																	}else{
																		connection.close(); // done with the connection
																		console.log("query friend again");
																		renderMessagePage(res, userID, results_friend, true, results_trip, false);
																	}
																}
													}); // end connection.execute	
													}else{
														connection.execute(query_trip, [],
																function(err, results_trip) {
																	if ( err ) {
																		console.log(err);
																	} else {
																		if(results_trip[0] != null){
																			connection.close(); // done with the connection
																			console.log("query friend again");
																			renderMessagePage(res, userID, results_friend, false, results_trip, true);
																		}else{
																			connection.close(); // done with the connection
																			console.log("query friend again");
																			renderMessagePage(res, userID, results_friend, false, results_trip, false);
																		}
																	}
														}); // end connection.execute	
													}
												}
									}); // end connection.execute	
								}
						
			}); // end connection.execute
			
					
	}
	}); // end oracle.connect
}



function denyTripInvites(res, user_inviting, trip_id){
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
			console.log(err);
		} else {
			var query_update = "UPDATE Invite SET status = 'denied' WHERE USER_ID_INVITED = '"+userID+"' AND USER_ID = '"+ user_inviting+"' AND TRIP_ID = '" + trip_id + "'";
			var query_friend ="SELECT * FROM Friend WHERE Friend.following_id = '" + userID + "' AND Friend.status = 'pending'";
			var query_trip = "SELECT * FROM Invite WHERE Invite.user_id_invited = '" + userID + "' AND Invite.status = 'pending'";
			connection.execute(query_update, [],
				function(err, results) {
					if ( err ) {
						console.log(err);
					} else {
						//connection.close(); // done with the connection
						console.log("friend table updated");	
						connection.execute(query_friend, [],
							function(err, results_friend) {
								if ( err ) {
									console.log(err);
								} else {
									if(results_friend[0] != null){
										//connection.close(); // done with the connection
										console.log("friend table query again");
										connection.execute(query_trip, [],
												function(err, results_trip) {
													if ( err ) {
														console.log(err);
													} else {
														if(results_trip[0] != null){
															connection.close(); // done with the connection
															console.log("friend table query again");
															
															renderMessagePage(res, userID, results_friend, true, results_trip, true);
														}else{
															renderMessagePage(res, userID, results_friend, true, results_trip, false);
														}
													}
											}); // end connection.execute	
										
									}else{
										//connection.close(); // done with the connection
										console.log("friend table query again");
										connection.execute(query_trip, [],
												function(err, results_trip) {
													if ( err ) {
														console.log(err);
													} else {
														if(results_trip[0] != null){
															//connection.close(); // done with the connection
															console.log("friend table query again");
															
															renderMessagePage(res, userID, results_friend, false, results_trip, true);
														}else{
															renderMessagePage(res, userID, results_friend, false, results_trip, false);
														}
													}
											}); // end connection.execute	
									}
								}
						}); // end connection.execute	
					}
			}); // end connection.execute
			
					
	}
	}); // end oracle.connect
}
