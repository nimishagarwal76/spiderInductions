var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser =  require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var cookieSession = require('cookie-session');
// Helmet helps you secure your Express apps by setting various HTTP headers.
var helmet = require('helmet');
var MongoDBStore = require('connect-mongodb-session')(session);
var User = require('./models/user.js');
var bcrypt = require('bcryptjs');
var expressSanitizer = require('express-sanitizer');


var app = express();
app.use(helmet());

// view engine setup
app.set('view engine','ejs');


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static('public'));


app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys:['nimishthegreat']
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

// adding routes
var route = require("./routes/route.js");
app.use('/',route);

passport.use(new LocalStrategy(
function(username, password, done){

  let query = {
    username : username,
  }
  User.findOne(query).then(function(result){
    console.log(result);

    if (result == null)
    {
      return done(null, false);
    }
    else
    {
      console.log(result.password);
      bcrypt.compare(password,result.password,function(err, response){
        if(response === true)
        {
          console.log('done');
          return done(null, result);
        }
        else
        {
              return done(null, false);
        }
      })

    }
  });
}
));

 passport.serializeUser(function(user,done){
   done(null, user.id);
 })


 passport.deserializeUser(function(id, done){
   User.findById(id).then((user)=>{
     done(null,user);
   })
 })



// set up Mongoose Connection
const mongoose = require('mongoose');
var db = mongoose.connection;

    mongoose.connect('mongodb://localhost/book');
    db.once('open', function(){
        console.log('Connection has been made, now make fireworks...');
    }).on('error', function(error){
        console.log('Connection error:', error);
    });

app.listen(3000,() => {
  console.log("app now listening for requests at port 3000");
});
