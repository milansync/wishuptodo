var express = require('express');
var router = express.Router();

var todo=require('../models/todo');
var passport =require('passport');
passport.initialize();



router.get('/', function(req, res) {
  res.render('index.ejs'); // load the index.ejs file
});


router.post('/login', function(req, res, next){

  passport.authenticate('local-login', function(err, user, info){
    if(err){
      return next(err);
    }

    if(user){
      //console.log(user.id);
      return res.json({ token: user.id ,message:"Login Successful"});
    }
    else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


router.post('/signup', function(req, res, next){

  passport.authenticate('local-signup', function(err, user, info){
    if(err){
      return next(err);
    }

    if(user){
      //console.log(user.id);
      return res.json({ token: user.id , message:"Created" });
    }
    else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.ejs', {
    user : req.user // get the user out of session and pass to template
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.post('/api/fetch', function(req, res) {


  todo.findById(req.body.token, function (err, post) {

    if(!err)
      res.json(post);
    else
      throw err;
  });
});
router.post('/api/todos', function(req, res) {


    console.log(req.body);

    todo.findById(req.body.token, function (err, post) {
      if(!err){
      post.todo.push(req.body);

      post.save();

      res.json(post.todo);
      }else {throw err;}

  });


});


router.delete('/api/todos/:todo_id/:token', function(req, res) {


  todo.findById(req.params.token, function (err, post) {
    if(!err){
    post.todo.id(req.params.todo_id).remove();
    post.save();

    res.json(post.todo);

    } else {throw err;}
  });

});


router.get('/api/todo/:todo_id/:token', function(req, res) {



  todo.findById(req.params.token, function (err, post) {

    if (!err){

    var x=post.todo.id(req.params.todo_id);


    var date_ch=new Date(x.date.getTime() + 10*60000);
    x.date=date_ch;
    post.save();
  //console.log(post.local.todo)
    res.json(post.todo);
    } else {throw err;}
  });


});







router.get('/auth/facebook',  passport.authenticate('facebook', { scope : 'email' }),
    function(error)
    {

      if(error)console.log(error);
    });

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

// =====================================
// TWITTER ROUTES ======================
// =====================================
// route for twitter authentication and login
router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'id' }),
   function(error)
   {

    if(error)console.log(error);
   });
// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/',
      failureRedirect : '/login'
    }));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

