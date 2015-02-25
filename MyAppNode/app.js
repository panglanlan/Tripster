/**
 * Simple Homework 2 application for CIS 550
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , actor = require('./routes/actor')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
  , login = require("./routes/login")
  , register = require('./routes/register')
  , signup = require('./routes/signup')
  , signin = require('./routes/signin')
  , userprofile = require('./routes/userprofile')
  , add_trip = require('./routes/add_trip')
  , edit_profile = require('./routes/edit_profile')
  , change_password = require('./routes/changePassword')
  , tripPage = require('./routes/tripPage')
  , add_friend = require('./routes/add_friend')
  , message = require('./routes/message')
  , news_feed = require('./routes/news_feed')
  , invite_friend = require('./routes/invite_friend')
  , addAlbum = require('./routes/addAlbum')
  , showContents = require('./routes/showContents')
  , addContents = require('./routes/addContents')
  , photoComments = require('./routes/photoComments')
  , addPhotoComment = require('./routes/addPhotoComment')
  , othersProfile = require('./routes/othersProfile')
  , search_frie_loc = require('./routes/search_frie_loc')
  , tripComments = require('./routes/tripComments')
  , addTripComment = require('./routes/addTripComment')
  , edit_trip = require('./routes/edit_trip')
  , othersTripComments = require('./routes/othersTripComments')
  , others_addTripComment = require('./routes/others_addTripComment')
  , adminMongo = require('./routes/adminMongo')
  //, query_constructtrip = require('./routes/construct_trip')
 // , addLocation = require('./routes/add_location')
;

// Initialize express
var app = express();


//var GridStore = MongoDb.GridStore;
// .. and our app
init_app(app);

//app.param(function(name, fn){
//	  if (fn instanceof RegExp) {
//	    return function(req, res, next, val){
//	      var captures;
//	      if (captures = fn.exec(String(val))) {
//	        req.params[name] = captures;
//	        next();
//	      } else {
//	        next('route');
//	      }
//	    }
//	  }
//	});
//
//app.param('trip_id',/^\d+$/);
app.get('/adminMongo', adminMongo.adminMongo);
app.get('/', routes.do_work);
app.post('/actor', actor.do_work);
app.post('/signin',signin.do_work);
app.post('/signup',signup.do_work);
app.get('/login', login.do_work);
app.get('/register', register.do_work);
app.post('/reset', signin.reset);
app.post('/userprofile',userprofile.do_work);
app.post('/edit_profile', edit_profile.do_work);
app.post('/query_edituserprofile', edit_profile.edit_profile);
app.post('/add_trip', add_trip.do_work);
app.post('/addtrip', add_trip.add_trip);
app.post('/changePassword', change_password.do_work);
app.post('/trip',tripPage.do_work);
app.post('/add_friend', add_friend.do_work);
app.post('/add_new_friend', add_friend.add_friend);
app.get('/message', message.do_work);
app.post('/accept_friend', message.accept_friend);
app.post('/deny_friend', message.deny_friend);
app.post('/news_feed', news_feed.do_work);
app.post('/invite_friend',invite_friend.do_work);
app.post('/invite_friend_to_trip',invite_friend.do_add_query);
app.post('/accept_trip', message.accept_trip);
app.post('/deny_trip', message.deny_trip);

app.post('/addalbum', addAlbum.add_album);
app.post('/add_album', addAlbum.do_work);
app.post('/showContents', showContents.do_work);
app.post('/addContents', addContents.do_work);
app.post('/add_contents', addContents.add_contents);
app.post('/photoComments', photoComments.do_work);
app.post('/add_photos_comments', addPhotoComment.do_work);
//app.post('/othersProfile', othersProfile.do_work);
app.post('/search_user', search_frie_loc.search_user);
app.post('/search_location', search_frie_loc.search_location);
app.post('/recommend_user', search_frie_loc.recommend_user);
app.post('/recommend_location', search_frie_loc.recommend_location);
app.post('/view_other_profile', othersProfile.do_work);
app.post('/tripComments', tripComments.do_work);
app.post('/add_trip_comments', addTripComment.do_work);
app.post('/othersTripComments', othersTripComments.do_work);
app.post('/others_addTripComment', others_addTripComment.do_work);

//app.post('/query_constructtrip', construct_trip.complete_trip);
app.post('/edit_trip',edit_trip.do_work);
app.post('/query_edittrip', edit_trip.edit_trip);
app.get('/signin_back',signin.do_work_2);
app.post('/othersTrip',tripPage.do_work_3);
app.post('/othersShowContents', showContents.do_work_2);
//app.post('/addLocation',addLocation.do_work);
//app.post('/trip/:trip_id',tripPage.do_work);


//////mongodb
var MongoDb = require("mongodb"),
db = new MongoDb.Db("test", new MongoDb.Server("localhost", 27000, {auto_reconnect: true}, {}),{fsync:false}),
fs = require("fs");
db.open(function(err, db) { }); // end of db.open
console.log('opening db..');
var GridStore = MongoDb.GridStore;
//var mongo= require('./routes/mongo');
//var mongoQuery= require('./routes/mongoQuery');
//var mongoQuery2= require('./routes/mongoQuery2');
//app.get('/mongo', mongo.mongo);
//app.get('/storemongo',mongoQuery.storemongo);
//app.get('/searchmongo',mongoQuery2.searchmongo);
app.get('/mongoimages/:imgtag', function(req, res) {
// retrieve image corresponding imgtag
console.log(req.params.imgtag);
var imageName = req.params.imgtag;
var imageType = imageName.charAt(imageName.length-3) + imageName.charAt(imageName.length-2) +imageName.charAt(imageName.length-1);
console.log(imageType);
loadImageGrid(imageName, imageType, res);
}
);
function loadImageGrid (imageName,imageType, res){
//console.log('Opening db to retreive an image');
// Define the file we want to read
var gs2 = new GridStore(db, imageName, "r");
// Open the file
gs2.open(function(err, gs2) {
if(err) throw err;
//console.log('Opening GS..');
// Set the pointer of the read head to the start of the gridstored file
gs2.seek(0, function() {
if(err) throw err;
//console.log('Pointing the head of the image to read..');
// Read the entire file
gs2.read(function(err, imageData) {
if(err) throw err;
//console.log('Reading the image..');
gs2.close(function(err, gs2) {
if(err) throw err;
//console.log('Done reading. Closing GS..');
// displaying the retrieved image
res.writeHead('200', {'Content-Type': 'image/' + imageType });
res.end(new Buffer(imageData).toString(),'base64');
}); // end of gs2.close
}); // end of gs2. read
}); // end of gs2.seek
}); // end of gs2.open
} 


/////mongodb_over

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));


	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}