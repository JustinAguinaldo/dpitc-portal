var keystone = require('keystone');
var http = require('http');

var helper = require('./../helper');

var ELearningVisit = keystone.list('ELearningVisit');
var ELearningLog = keystone.list('ELearningLog');
var Course = keystone.list('Course');
var LearningContent = keystone.list('LearningContent');


exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  locals.section = 'courses';
  locals.url = '/elearning/courses?';

  locals.viewStyle = req.query.view == undefined ? 'grid' : req.query.view;
  locals.page = req.query.page == undefined ? 1 : req.query.page;
  locals.perPage = req.query.perPage == undefined ?  12 : req.query.perPage;
  locals.sort = req.query.sort == undefined ? 'titleAZ' : req.query.sort;

  var sortOrder;
  switch(locals.sort) {
    case 'titleAZ':
      sortOrder =  'title';
      break;
    case 'titleZA':
      sortOrder =  '-title';
      break;
    case 'authorAZ':
      sortOrder =  'author';
      break;
    case 'authorZA':
      sortOrder =  '-author';
      break;
    case 'dateNew':
      sortOrder =  '-publishedAt';
      break;
    case 'dateOld':
      sortOrder = 'publishedAt';
      break;
    default:
      sortOrder =  'title';
  }

  locals.formData = req.body || {};
  locals.courses = [];

  var pageData = {
    loginRedirect: '/elearning/courses?',
    breadcrumbs: [
      { text: 'ELearning', link: '/elearning' },
      { text: 'Courses', link: '/elearning/courses?' },
    ]
  }

  /* Search */
  view.on('get', { action: 'elearning.search' }, function (next) {
    return res.redirect('/elearning/search?key='+req.query.search+'&from='+locals.url);
    next();

  });

  view.on('init', function(next){
        Course.paginate({
            page: locals.page,
            perPage: locals.perPage,
            maxPages: 10,
        })
        .where('state', 'published')
        .sort(sortOrder)
        .exec(function(err, results){
            locals.courses = results;
            next(err);
        });
    });

  //insert ELearning Visit
  view.on('init', function(next){
    var currentUser = locals.user;
    var isLOUser = false;//suburb = city/municipality, state = region

    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    var options = {    
        host: 'freegeoip.net',    
        path: '/json/' + ip,
        method: 'GET'
    };
    var getGeoLocation = false;
    if(currentUser){
      isLOUser = true;
      if(currentUser.location.suburb!=null&&currentUser.location.state!=null){
         var newVisit = new ELearningVisit.model({
            country_code: 'PH',
            region: currentUser.location.state,
            city: currentUser.location.suburb,
            isUser: isLOUser
          });
          newVisit.save(function(err) {
          });

          var newLog = new ELearningLog.model({
                //ip: obj.ip,
                user: currentUser.email,
                event: 'VISITED '+ locals.url,
              });
              newLog.save(function(err) {
                console.log(newLog.user + ' ' + newLog.event);
              });
      }
      else{
        getGeoLocation = true;
      }
    }
    else{
      getGeoLocation = true;
    }
    if(getGeoLocation==true){
      var reqData = http.request(options, function(res) {
        if (('' + res.statusCode).match(/^2\d\d$/)) {
          res.setEncoding('utf8');    
          res.on('data', function (chunk) {  
              var obj = JSON.parse(chunk);
              var newVisit = new ELearningVisit.model({
                ip: obj.ip,
                country_code: obj.country_code,
                region: obj.region_name,
                city: obj.city,
                isUser: isLOUser
              });
              newVisit.save(function(err) {
                console.log("success in inserting geolocation");
              });

              var newLog = new ELearningLog.model({
                //ip: obj.ip,
                user: obj.ip,
                event: 'VISITED '+ locals.url,
              });
              newLog.save(function(err) {
                console.log(newLog.user + ' ' + newLog.event);
              });
          });
        }
        else if (('' + res.statusCode).match(/^5\d\d$/)){

        }
      });
      reqData.on('error', function (e) {
        console.log('error getting geolocation');
      });
      reqData.write('data\n');
      reqData.write('data\n');
      reqData.end();
    }
    next();
  });


  // Render the view
  view.render('elearning/content/courseList', pageData);

};
