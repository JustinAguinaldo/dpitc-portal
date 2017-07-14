var keystone = require('keystone');
var Fiesta = keystone.list('Fiesta');

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
		var q = keystone.list('Fiesta').model.find().sort({ title: 1 })

		q.exec(function (err, results) {
			locals.data.contents_fiesta = results;
			next(err);
		});

	});

	view.on('post',{action: 'createFiesta'}, function (next) {
		var newFiesta = new Fiesta.model({
			title:locals.formData.title
		});

		var updater = newFiesta.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newFiesta);
          		req.flash('success', 'Fiesta created');         
          		return res.redirect('/admin/contents-fiesta');
       	 	}
        next();
    	});
	});	
	
	view.render('admin/contents_fiesta',pageData);
};