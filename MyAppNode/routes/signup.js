        
exports.do_work = function(req, res){    
        query_db(res,req.body.userID,req.body.name,req.body.password
                ,req.body.affiliation, req.body.email, req.body.privacy, req.body.interest);
    };
     
    var connectData = {
        "hostname": "cis5502.cxl9ekvm2ckb.us-east-1.rds.amazonaws.com",
        "user": "oracle",
        "password": "12345678",
        "database": "ORCL" };
    var oracle =  require("oracle");
         
    var bcrypt = require('bcrypt');
     
    function query_db(res, userID, name, password, affiliation, email, privacy, interest) {
         
        console.log(userID, name, password, affiliation, email, privacy, interest);
        userID = userID.replace(/\s/g, '');
        password =password.replace(/\s/g, '');
            console.log(userID);
            console.log(password);
             
          oracle.connect(connectData, function(err, connection) {
                if ( err ) {
                    console.log(err);
                } else {
             
                    var query="SELECT USER_ID FROM USERS WHERE USER_ID = '" +  userID +
                    "' ";
                    connection.execute(query,
                               [],
                               function(err, results) {
                        if ( err ) {
                            console.log(err);
                        } else {
                            connection.close(); // done with the connection
                            //console.log("User Check Successful");
                            //console.log(results);
                            //Updating the global variable
                             
                             
                            if (results[0] == null )
                                {
                                console.log("No User Found`");
                                 query_db2(res, userID, name, password, affiliation, email, privacy, interest);
                                }
                            else
                                {
                                fail = true;
                                console.log("Error: user found");
                                resultFail(res,fail);
                                 
                                 
 
                                }
                             
                            // If result is found, autheneticate,
                            // Store userName as userName.
                            //
                            //output_photos(res, searchTags, PageNum,results);
                        }
                 
                    }); // end connection.execute
                }
              }); // end oracle.connect
            };
         
     
 
function query_db2(res, userID, name, password, affiliation, email, privacy, interest) {
    console.log("Success: No users found");
    console.log(userID);
    console.log(name, password, affiliation, email, privacy, interest);
     oracle.connect(connectData, function(err, connection) {
            if ( err ) {
                console.log(err);
            }
            else
                {
                 
             
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
          
                var query="INSERT INTO USERS (USER_ID, FULL_NAME,PWD,AFFILIATION,EMAIL,PRIVACY,INTEREST) VALUES( '" +  userID +
                "'  ,  '"+ name+"', '"+ hash+"', '"+ affiliation+"', '"+ email+"', '"+ privacy+"', '"+ interest+"') ";
                 
                console.log(hash);
                connection.execute(query,
                           [],
                           function(err) {
                    if ( err ) {
                        console.log(err);
         
                    }
                    else
                    {  
                    // For Dev
                    console.log("Sucessfully Inserted User");
                    connection.close();
                    success = true;
                    
                    resultSuccess(res,success);
                    }
                }); // end connection.execute
                }
              }); // end oracle.connect
            }
 
 
 
 
function resultSuccess(res,success) {
    res.render('index',
          {
          success: success = true,
          fail: fail =false
            }  
     
      );
}
 
    function resultFail(res,fail) {
        res.render('register',
              {
              fail: fail = true
     
                }  
         
          );
    }
    
