var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var username = require('');
var notes_controller = require("../controllers/notes_controller");
var todos_controller = require("../controllers/todos_controller");
var bodyParser =  require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.get('/:user/all_note', authenticationMiddleware(), notes_controller.all_note);

router.get('/:user/create_note',authenticationMiddleware(),notes_controller.create_note_get);

router.post('/:user/create_note',notes_controller.create_note_post);

router.get('/:user/note/:id',authenticationMiddleware(), notes_controller.note_detail);

router.get('/:user/note/:id/delete',authenticationMiddleware(),notes_controller.note_delete);

router.get('/:user/note/:id/update',authenticationMiddleware(),notes_controller.note_update_get);

router.post('/:user/note/:id/update',notes_controller.note_update_post);

router.get('/:user/create_todo',authenticationMiddleware(), function(req, res){
  res.render('create_todo',{user:req.user});
});

router.post('/:user/create_todo',urlencodedParser,todos_controller.todo_create_post);

router.post('/:user/all_note', notes_controller.search);

router.get('/:user/all_todo',authenticationMiddleware(),todos_controller.all_todo);

router.post('/:user/note/:id',notes_controller.collab);

router.post('/:user/note/:id/remove',notes_controller.collabremove);

router.post("/:user/note/:id/addimage",notes_controller.addimage);

router.get("/:user/lastedited",notes_controller.lastedited);

router.get("/:user/importance",notes_controller.importance);

router.get("/:user/todo/:id/update",todos_controller.update_get);

router.post("/:user/todo/:id/update",todos_controller.update_post);

router.get('/logout',function(req,res){
  // console.log('a',req.isAuthenticated());
  req.logout();//changes the value of isAuthenticated() from true to false
  // console.log('b',req.isAuthenticated());
  req.session.destroy();
  res.redirect('/todoapp/home');
});

router.get('/home',function(req,res){
  res.render('home');
});

router.get('/login',function(req,res){
  res.render('login');
});

router.get('/register',function(req,res){
  var errors = [{msg:'' }];
  res.render('register',{errors:errors});
});

router.post('/register',function(req,res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

   //express validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);



  var errors = req.validationErrors();
  if(errors)
  {
    res.render('register',{errors:  errors});
  }
  else
  {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        password = hash;
        var user = new User({
          username: req.body.username,
          password: password ,
          email : req.body.email,
          name : req.body.name
        });
        user.save();
      });
    });
    res.redirect('/todoapp/login');
  }
  console.log(errors);

});

//   router.post('/login',passport.authenticate('local',{
//   successRedirect:'/todoapp/all_note',
//   failureRedirect:'/todoapp/login'
// }));


// When the login operation completes, user will be assigned to req.user.
// if authentication fails user is set to false
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/todoapp/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log('na',req.user);
      return res.redirect('/todoapp/'+req.user+'/all_note' );
    });
  })(req, res, next);
});


passport.serializeUser(function(user_id,done){
  done(null, user_id);
})

passport.deserializeUser(function(user_id, done){
    done(null,user_id);
})

function authenticationMiddleware () {
	return (req, res, next) => {
	    if (req.isAuthenticated()) return next();
	    res.redirect('/todoapp/login')
	}
}

module.exports = router;
