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
			{ text: 'Base Pages', link: '/admin/base-pages'},
			{ text: 'Pages', link: '/admin/pages'}
		]
  	};

	//init locals
	locals.data = {
		base_pages: [],
		pages:[],
		path:req.path,
	};
	
	view.render('admin/base_pages',pageData);
};