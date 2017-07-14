var keystone = require('keystone');
var Technology = keystone.list('Technology');

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
			{ text: 'FIESTA', link: '/admin/contents-fiesta'},
			{ text: 'Technologies', link: '/admin/technologies'},
            { text: 'Sliders', link: '/admin/sliders'}
		]
  	};

	//init locals
	locals.section = 'users';
	locals.formData = req.body;
	locals.data = {
		contents_fiesta: [],
		technologies:[],
        sliders: [],
		path:req.path,
	};

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('Technology').model.find().sort({ title: 1 })

		q.exec(function (err, results) {
			locals.data.technologies = results;
			next(err);
		});

	});

	view.on('post',{action: 'createTechnologies'}, function (next) {
		var newTechnology = new Technology.model({
			title:locals.formData.title
		});

		var updater = newTechnology.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newTechnology);
          		req.flash('success', 'Technology created');         
          		return res.redirect('/admin/technologies');
       	 	}
        next();
    	});
	});	
	
	view.render('admin/technologies',pageData);
};