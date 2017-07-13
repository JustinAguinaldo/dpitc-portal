var keystone = require('keystone');
var User = keystone.list('User');
var	async = require('async');


exports = module.exports = function(req, res) {
	if (req.user) {
		return res.redirect(req.cookies.target || '/signup');
	}
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	locals.formInput = req.body || {};
  	locals.validationErrors = {};

	var pageData = {
    loginRedirect: ''
	};
	

	view.on('post', { action: 'signup' }, function(next) {	
		var newUser = new User.model({
			name: {
				first: locals.formInput.first,
				last: locals.formInput.last
			},
			birthday: locals.formInput.birthday,
			age: locals.formInput.age,
			address: {
				street: locals.formInput.street,
				city: locals.formInput.city,
				province: locals.formInput.province
			},
			consumerType: locals.formInput.consumerType,
			agencyAffiliation: locals.formInput.agencyAffiliation,
			sex: locals.formInput.sex,
			contactNumber: locals.formInput.contactNumber
		});

		var updater = newUser.getUpdateHandler(req);

		updater.process(req.body, {
        	fields: 'email, password, birthday',
        	flashErrors: true,
        	logErrors: true
      	}, function(err,result) {
        	if (err) {   
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newUser);
          		req.flash('success', 'Account created. Please sign in.');         
          		return res.redirect('/keystone/signin');
       	 	}
        	next();
      	});
		
	});
	
	view.render('signup');	
};
