
exports.do_work = function(req, res){
	  console.log("no cookies");
	  res.render('login',
			  {
			  //success: success = false,
			  fail: fail = false
			  }
			  );
};