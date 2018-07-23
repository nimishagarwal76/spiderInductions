var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user.js');
var Book = require('../models/books.js');
// var Invitation = require('../models/invitation.js');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser =  require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var user_controller = require("../controllers/user.js");
// var calendar_controller = require("../controllers/calendar.js");
// var ajax_controller = require("../controllers/ajax.js");
var passport = require('passport');
var sanitize = require('mongo-sanitize');
var request = require('request');
const fetch = require('node-fetch');

const authenticationMiddleware = (req, res, next) => {
  if(!req.user)
  {
    // if user is not logged in
    res.redirect('/login')
  }
  else
  {
    next();
  }
}

router.get('/',function(req, res){
  res.redirect('/home');
});

router.get('/logout', user_controller.logout);

router.get('/home', user_controller.home);

router.get('/login', user_controller.login);

router.get('/register',user_controller.register_get);

router.post('/register',user_controller.register_post);

// When the login operation completes, user will be assigned to req.user.
// if authentication fails user is set to false

router.post('/login', passport.authenticate('local', {
  successRedirect: '/entry',
  failureRedirect: '/login',
}));


router.get('/entry',function(req,res){;
  res.redirect('/'+req.user.username);
});

router.get('/ajax/user',user_controller.userCheck);

router.get('/ajax/bookshelf',authenticationMiddleware ,function(req, res){
    console.log('hola');
    User.findOne({username:req.user.username},function(err,result){
      res.send(JSON.stringify(result));
    });

  });

router.get('/ajax/activity/:user',authenticationMiddleware,function(req,res){
  console.log('just Finished',req.params);
  User.findOne({username:req.params.user},{activity:1},function(err,result){
    res.send(JSON.stringify(result));
  })
})


router.get('/ajax/like',authenticationMiddleware,function(req, res){
  User.findOne({username:req.user.username},function(err,result){
    if(err) throw err;
    var found = false;
    for(i = 0; i < result.book.length; ++i)
    {
      if(result.book[i].id == req.query.id)
      {
        console.log('its there');
        result.book[i].like = req.query.like;
        found = true;
      }
    }
    if(!found)
    {
      result.book.push({id:req.query.id,like:Boolean(req.query.like)});
      console.log('its not there');
    }
    result.save();
  });
  Book.findOne({id:req.query.id},function(err,result){
    if(err) throw err;
    if(result)
    {
      console.log('like',req.query.like,typeof req.query.like);
      if(req.query.like=='true')
      {
        console.log('in here',Boolean(req.query.like));
        result.like++;
      }
      else
      {
        console.log('in false string');
        result.like--;
      }
      result.save();
    }
    else
    {
      var book = new Book({
        id:req.query.id,
        like:1
      });
      book.save();
    }
  });
});

router.get('/:user',authenticationMiddleware,(req,res)=>{
  User.findOne({username:req.user.username},function(err,result){
    res.render('bookshelf',{user:req.user.username, books:result});
  });
});

router.get('/:user/friends',authenticationMiddleware,function(req, res){
  console.log('user',req.user);
  User.findOne({username:req.user.username},function(err,result){
  res.render('friends',{data:result,user:req.user.username});
  })

});


router.post('/:user/friends',authenticationMiddleware,function(req,res){
  console.log(req.body);
  User.findOne({username:req.body.friend},function(err, result){
    console.log('result',result);
    if(result)
    {
      let temp = Array.from(result.request);
      if(temp.indexOf(req.user.username)<0)
      temp.push(req.user.username);
      console.log(temp);
      result.request = temp;
      result.save();
    }
    User.findOne({username:req.user.username},function(err, result){
    res.render('friends',{data:result});
    });
  });
});


router.post('/query',authenticationMiddleware,function(req,res){
  console.log('m here');
  console.log('body',req.body);
  res.redirect('/'+req.user.username+'/search?q='+req.body.search+'&category='+req.body.category);
});

router.get('/:user/search',authenticationMiddleware,authenticationMiddleware,function(req,res){
  var fetchURL = `https://www.googleapis.com/books/v1/volumes?q=${req.query.category}${req.query.q}&key=AIzaSyBb5GaFXlvkaw-tDgEwhZ-Jj1hpRn6laos`;
  fetch(fetchURL)
  .then((res)=>res.json())
  .then((data)=>{
    User.findOne({username:req.user.username},{book:1},function(err, result){
      console.log('bookRes',result);
      res.render('booksearch',{items:data.items,user:req.user.username, info:result});
    });
  });

});

router.get('/ajax/bookFav',function(req,res){
  if(req.query.fav == 'true')
  {
    User.findOne({username:req.user.username},function(err,result){
      if(err) throw err;
      result.favourite.push({id:req.query.id, img:req.query.img, title:req.query.title});
      result.save();
    });
  }
  else
  {
    User.findOne({username:req.user.username},function(err,result){
      if(err) throw err;
      result.favourite = result.favourite.filter(function(book){
        if(book.id!=req.query.id)
        {
          return book;
        }
      });
      result.save();
    });
  }
});


router.get('/ajax/book',authenticationMiddleware,function(req,res){
  console.log(req.query);
  if(req.query.status == 'want')
  {
    User.findOne({username:req.user.username},function(err,result){
      if(err) throw err;
      result.book.push({id:req.query.id, status:'want'});
      result.activity.push({type:'want', id:req.query.id, title:req.query.title});
      result.want.push({id:req.query.id, img:req.query.img, title:req.query.title});
      result.save();

    });
  }


  if(req.query.status == 'read')
  {
    User.findOne({username:req.user.username},function(err,result){
      if(err) throw err;
      result.book.push({id:req.query.id, status:'want'});
      result.activity.push({type:'read', id:req.query.id, title:req.query.title});
      result.read.push({id:req.query.id, img:req.query.img, title:req.query.title});
      result.save();
    });
  }

  if(req.query.status == 'reading')
  {
    User.findOne({username:req.user.username},function(err,result){
      if(err) throw err;
      result.book.push({id:req.query.id, status:'want'});
      result.activity.push({type:'reading', id:req.query.id, title:req.query.title});
      result.reading.push({id:req.query.id, img:req.query.img, title:req.query.title});
      result.save();

    });
  }

  res.send('done');
});


router.get('/:user/activity',authenticationMiddleware,function(req,res){
  User.findOne({username:req.user.username},{activity:1,username:1},function(err,result){
    console.log('activity',result);
    res.render('activity',{user:req.user.username, activity:result.activity, activityUser:result.username});
  });
});


router.get('/ajax/act',authenticationMiddleware,function(req,res){
  console.log('activity');
  User.findOne({username:req.user.username},{activity:1,_id:0},function(err,result){
    console.log('from activity',JSON.stringify(result));
    res.send(JSON.stringify(result));
  });
});


router.get('/:user/:id',authenticationMiddleware,(req,res)=>{
  var fetchURL = `https://www.googleapis.com/books/v1/volumes/${req.params.id}?key=AIzaSyBb5GaFXlvkaw-tDgEwhZ-Jj1hpRn6laos`;
  fetch(fetchURL)
  .then((res)=>res.json())
  .then((data)=>{
    Book.findOne({id:req.params.id},function(err,result){
      console.log('result',result);
      console.log('comments',result);
      // console.log('data',data);
      res.render('bookDetail',{result:data, user:req.user.username, comments:result});
      // res.json(data);
    });
  });

});

router.post('/:user/:id',authenticationMiddleware,function(req,res){
  // User.findOne({username:req..user.username},function(err,result){
  //   if(err) throw err;
  //
  // })

  Book.findOne({id:req.params.id},function(err,result){
    if(err) throw err;

    if(result)
    {
      result.comment.push({
        user:req.user.username,
        text:req.body.comment
      });
      result.save();
    }
    else
    {
      var book = new Book({
        id:req.params.id,
        comment:[{
          user:req.user.username,
          text:req.body.comment
        }]
      });
      book.save();
    }

    res.redirect('/'+req.user.username+'/'+req.params.id);
  });
});



module.exports = router;
