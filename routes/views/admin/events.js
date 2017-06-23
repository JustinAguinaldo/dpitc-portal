var keystone = require('keystone');

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
			{ text: 'Users', link: '#'},
			{ text: 'Analytics', link: '#'},
			{ text: 'Community', link: '/admin/blog-posts'},
			{ text: 'Publications', link: '#'},
			{ text: 'Categories', link: '#'},
			{ text: 'ELearning', link: '#'}
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
	
	view.render('admin/events',pageData);
};