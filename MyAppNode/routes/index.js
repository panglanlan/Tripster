
/*
 * GET home page, which is specified in Jade.
 */
var signin = require("./signin");

exports.do_work = function(req, res){

	  res.render('index.jade', { 
		  title: 'HW2' 
	  });
};
