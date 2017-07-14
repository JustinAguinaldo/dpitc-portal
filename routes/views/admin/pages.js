var keystone = require('keystone');
var Page = keystone.list('Page');

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
			{ text: 'Base Pages', link: '/admin/base-pages'},
			{ text: 'Pages', link: '/admin/pages'}
		]
  	};

	//init locals
	locals.section = 'users';
	locals.formData = req.body;
	locals.data = {
		base_pages: [],
		pages:[],
		path:req.path,
	};

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('Page').model.find().sort({ title: 1 })

		q.exec(function (err, results) {
			locals.data.pages = results;
			next(err);
		});

	});

	view.on('post',{action: 'createPages'}, function (next) {
		var newPage = new Page.model({
			title:locals.formData.title
		});

		var updater = newPage.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newPage);
          		req.flash('success', 'Page created');         
          		return res.redirect('/admin/pages');
       	 	}
        next();
    	});
	});	
	
	view.render('admin/pages',pageData);
};