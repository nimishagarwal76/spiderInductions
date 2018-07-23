var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser =  require('body-parser');
var multer = require('multer');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
// Helmet helps you secure your Express apps by setting various HTTP headers.
var helmet = require('helmet');
var MongoDBStore = require('connect-mongodb-session')(session);
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user.js');
var bcrypt = require('bcryptjs');

var app = express();
app.use(helmet());

// view engine setup
app.set('view engine','ejs');


//storage engine setup
const storage = multer.diskStorage({
  destination : './public/uploads/',
  filename : function(req,file,callback){
      callback(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
  }
});

//init uploads
const upload = multer({
  storage:storage,
  // limits:{filesize:10 }
}).single('myImage');
module.exports = upload;


//express Validator
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

//express session

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/noteapp',
  collection: 'mySessions'
});

store.on('connected', function() {
  store.client; // The underlying MongoClient object from the MongoDB driver
});



app.use(session({
  secret:'secret',
  saveUninitialized : false,
  resave : false,
  store : store
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

var route = require("./routes/route.js");
// adding routes
app.use('/todoapp',route);
// app.use('/users', users);
// app.use('/catalog', catalog); // Add catalog routes to middleware chain.


passport.use(new LocalStrategy(
function(username, password, done){
  console.log(username);
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
          // module.exports.username = username
          return done(null, username);


        }
        else
        {
              return done(null, false);
        }
        // return done(null, 'fds');
      })
      // console.log(passw);
      // if(result.password === password )

    }

    // return done(null, false);
  });
}
));
  // console.log(password);
  // console.log(username);






// set up Mongoose Connection
  const mongoose = require('mongoose');
var db = mongoose.connection;

    mongoose.connect('mongodb://localhost/noteapp');
    db.once('open', function(){
        console.log('Connection has been made, now make fireworks...');
    }).on('error', function(error){
        console.log('Connection error:', error);
    });
//==============================================================================
// var Note = require('./models/notes.js');
// var temp = new Note({
//   title:'first',
//   content:'this is to test mongoDB '
// });
// temp.save();

//
// app.get('/', function(req, res, next) {
//   res.send('this is home page');
// });

app.listen(3000);
