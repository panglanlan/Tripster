var connectData = {
          "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com",
          "user": "oracle",
          "password": "12345678",
          "database": "ORCL" };
        var oracle =  require("oracle");
 
 
exports.search_user = function(req, res){
    console.log("user id or username to be searched:"+ req.body.user);
    show_user_list(res,req.body.user);
};
 
exports.search_location = function(req, res){
    console.log("location name to be searched: "+ req.body.location);
    show_location_list(res,req.body.location);
};
 
 
exports.recommend_user = function(req, res){
    console.log("Recommending user...");
    recommend_user_list(res);
};
 
exports.recommend_location = function(req, res){
    console.log("Recommending location....");
    recommend_location_list(res);
};
 
 
exports.displaysearch = function(req, res){
    res.render('news_feed');
};
 
function show_user_list(res, search) {
    oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
            var query="SELECT * FROM Users WHERE user_id = '" + search + "' OR full_name = '" + search +"' ";
            connection.execute(query, [],
                    function(err, results) {
                        if ( err ) {
                            console.log(err);
                        } else {
                            connection.close(); // done with the connection
                            //console.log(results[0]);
                            //console.log("first result of search user:  "+ results[0].USER_ID);
                            renderUserPage(res, results);
                        }
        }); // end connection.execute
    }
    }); // end oracle.connect
    }
 
 
function recommend_user_list(res, search) {
    oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
            var query="SELECT UU.USER_ID, UU.FULL_NAME, UU.PRIVACY FROM USERS UU WHERE UU.USER_ID IN (SELECT U1.USER_ID FROM USERS U1 INNER JOIN USERS U2 ON U1.INTEREST=U2.INTEREST WHERE U1.USER_ID !='"+userID+"' AND U2.USER_ID ='"+userID+"' MINUS SELECT DISTINCT FRIEND.FOLLOWING_ID FROM FRIEND WHERE FRIEND.FOLLOWED_ID = '"+userID+"' AND FRIEND.STATUS = 'accept')";
            connection.execute(query, [],
                    function(err, results) {
                        if ( err ) {
                            console.log(err);
                        } else {
                            connection.close(); // done with the connection
                            //console.log(results[0]);
                            //console.log("first result of recommended user:  "+ results[0].USER_ID);
                            renderUserPage(res, results);
                        }
        }); // end connection.execute
    }
    }); // end oracle.connect
    }
 
function renderUserPage(res,results) {
    //console.log(results[0].PRIVACY);
    res.render('search_user',
            {
                results: results
            }
        );
}
 
 
 
function show_location_list(res, search) {
    oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
            var query="SELECT * FROM locations WHERE location_name = '" + search + "' ";
            connection.execute(query, [],
                    function(err, results) {
                        if ( err ) {
                            console.log(err);
                        } else {
                            connection.close(); // done with the connection
                            //console.log(results[0]);
                            //console.log("first result of search location:  "+ results[0].LOCATION_NAME);
                            renderLocationPage(res, results);
                        }
        }); // end connection.execute
    }
    }); // end oracle.connect
    }
 
 
 
 
 
function recommend_location_list(res) {
    oracle.connect(connectData, function(err, connection) {
        if ( err ) {
            console.log(err);
        } else {
            var query="SELECT * FROM LOCATIONS WHERE LOCATION_TYPE IN (SELECT DISTINCT LOCATIONS.LOCATION_TYPE FROM LOCATIONS INNER JOIN ADD_LOCATIONS ON ADD_LOCATIONS.LOCATION_ID = LOCATIONS.LOCATION_ID INNER JOIN INVITE ON INVITE.TRIP_ID = ADD_LOCATIONS.TRIP_ID WHERE INVITE.USER_ID_INVITED = '" + userID + "' OR INVITE.USER_ID = '" + userID + "')";
            connection.execute(query, [],
                    function(err, results) {
                        if ( err ) {
                            console.log(err);
                        } else {
                            connection.close(); // done with the connection
                            //console.log(results[0]);
                            //console.log("first result of recommended location:  "+ results[0].LOCATION_NAME);
                            renderLocationPage(res, results);
                        }
        }); // end connection.execute
    }
    }); // end oracle.connect
    }
 
 
 
 
function renderLocationPage(res,results) {
    res.render('search_location',
            {
                results: results
            }
        );
}