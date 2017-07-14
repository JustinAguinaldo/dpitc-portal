var keystone = require('keystone');
var Slider = keystone.list('Slider');

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
		var q = keystone.list('Slider').model.find().sort({ name: 1 })

		q.exec(function (err, results) {
			locals.data.sliders = results;
			next(err);
		});

	});

	view.on('post',{action: 'createSliders'}, function (next) {
		var newSlider = new Slider.model({
			name:locals.formData.name
		});

		var updater = newSlider.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newSlider);
          		req.flash('success', 'Slider created');         
          		return res.redirect('/admin/sliders');
       	 	}
        next();
    	});
	});	
	
	view.render('admin/sliders',pageData);
};