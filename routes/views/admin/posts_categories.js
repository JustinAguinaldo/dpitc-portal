var keystone = require('keystone');
var PostCategory = keystone.list('PostCategory');

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
			{ text: 'Posts', link: '/admin/posts'},
			{ text: 'Post-Categories', link: '/admin/posts-categories'}
		]
  	};

	//init locals
	locals.section = 'users';
	locals.formData = req.body;
	locals.data = {
		posts: [],
		posts_categories:[],
		path:req.path,
	};

	// Load other posts
	view.on('init', function (next) {
		var q = keystone.list('PostCategory').model.find().sort({ name: 1 })

		q.exec(function (err, results) {
			locals.data.posts_categories = results;
			next(err);
		});

	});

	view.on('post',{action: 'createPostsCategories'}, function (next) {
		var newPostCategory = new PostCategory.model({
			name:locals.formData.name
		});

		var updater = newPostCategory.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newPostCategory);
          		req.flash('success', 'Post Category created');         
          		return res.redirect('/admin/posts-categories');
       	 	}
        next();
    	});
	});
	
	view.render('admin/posts_categories',pageData);
};