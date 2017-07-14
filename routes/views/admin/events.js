var keystone = require('keystone');
var Event = keystone.list('Event');

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
			{ text: 'Blog Posts', link: '/admin/blog-posts'},
			{ text: 'Trainings', link: '/admin/trainings'},
            { text: 'Events', link: '/admin/events'},
            { text: 'Discussions', link: '/admin/discussions'},
            { text: 'Discussions Comments', link: '/admin/discussions-comments'},
            { text: 'Links', link: '/admin/links'},
            { text: 'Galleries', link: '/admin/galleries'},
            { text: 'Videos', link: '/admin/videos'},
            { text: 'Memos', link: '/admin/memos'}
		]
  	};

	//init locals
	locals.section = 'users';
	locals.formData = req.body;
	locals.data = {
		blog_posts: [],
		trainings:[],
        events:[],
        discussions:[],
        discussion_coments:[],
        links:[],
        galleries:[],
        videos:[],
        memos:[],
		path:req.path,
	};

	// Load other events
	view.on('init', function (next) {
		var q = keystone.list('Event').model.find().sort({ title: 1 })

		q.exec(function (err, results) {
			locals.data.events = results;
			next(err);
		});

	});

	view.on('post',{action: 'createEvents'}, function (next) {
		var newEvent = new Event.model({
			title:locals.formData.title,
			startDate:locals.formData.startDate,
			endDate:locals.formData.endDate
		});

		var updater = newEvent.getUpdateHandler(req);

		updater.process(req.body, {
        flashErrors: true,
        logErrors: true
      	}, function(err,result) {
        	if (err) {    
          		locals.validationErrors = err.errors;
        	} else {
          		console.log(newEvent);
          		req.flash('success', 'Event created');         
          		return res.redirect('/admin/events');
       	 	}
        next();
    	});
	});	
	
	view.render('admin/events',pageData);
};