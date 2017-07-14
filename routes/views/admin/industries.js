var keystone = require('keystone');
var Industry = keystone.list('Industry'); 

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var path;

	var pageData = {
		title:'Admin Dashboard',
		navLinks: [
			{ text: 'Home', link: '/admin' },
			{ text: 'Posts', link: '/admin/posts'},
			{ text: 'Contents', link: '/admin/contents-fiesta'},
			{ text: 'Pages', link: '/admin/base-pages'},
			{ text: 'Users', link: '/admin/users'},
			{ text: 'Analytics', link: '/admin/community-views'},
			{ text: 'Community', link: '/admin/blog-posts'},
			{ text: 'Publications', link: '/admin/publication-settings'},
			{ text: 'Categories', link: '/admin/industries'},
			{ text: 'ELearning', link: '/admin/learning-objects'}
		],
		breadcrumbs:[
			{ text: 'Industries', link: '/admin/industries'},
			{ text: 'Sectors', link: '/admin/sectors'},
            { text: 'Commodities', link: '/admin/commodities'},
		]
  	};

	//init locals
	locals.section = 'users';
	locals.formData = req.body;
	locals.data = {
		industries: [],
		sectors:[],
        commodities:[],
		path:req.path,
	};

	// Load other industries
	view.on('init', function (next) {
		var q = keystone.list('Industry').model.find().sort({ name: 1 })

		q.exec(function (err, results) {
			locals.data.industries = results;
			next(err);
		});

	});

	view.on('post',{action: 'createIndustry'}, function (next) {
		var newIndustry = new Industry.model({
			name:locals.formData.name
		});

		var updater = newIndustry.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newIndustry);
          		req.flash('success', 'Industry created');         
          		return res.redirect('/admin/industries');
       	 	}
        next();
    	});
	});
	
	view.render('admin/industries',pageData);
};