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
	locals.data = {
		base_pages: [],
		pages:[],
		path:req.path,
	};
	
	view.render('admin/base_pages',pageData);
};