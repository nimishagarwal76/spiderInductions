var Note = require('../models/notes.js');
var Todo = require('../models/todo.js');
var upload = require('../app.js');
var User = require('../models/user.js');


exports.all_todo = function (req,res) {
  let query ={
    owner:req.user
  }
  Todo.find(query).then(function(result){
    console.log("rr",result);
      res.render("all_todo",{results : result , user : req.user});
    });

  };

exports.todo_create_post = function(req, res){
  var json = req.body;

    console.log("body:",req.body);

    var todo = new Todo({
      content:json,
      date : new Date(),
      owner : [req.user],
    });
    // console.log('_id',note._id);
    todo.save();
    var user = req.user;
    res.send(user);
};

exports.update_get = function (req,res){
  // res.render('todo_update',{user:req.user});
  // res.send('done');
  Todo.find({_id:req.params.id}).then(function(result){
      res.render("todo_update",{results : result , user : req.user});
      // console.log(result);
    });


};


exports.update_post = function(req, res){
  console.log(req.body.todo);
  Todo.findOne({_id:req.params.id},function(err,result){
    if (err) throw err;
    // var
    console.log("S",Object.keys(result.content));
    console.log("N",result.content);
    console.log('hola');
    for(var j = 1; j < Object.keys(result.content).length; j+=2)
    {
      result.content[Object.keys(result.content)[j]] = 0;
    }
    for(var i = 0; i < req.body.todo.length; i += 1 )
     {
       var temp = 0;
      for(var j = 0; j < Object.keys(result.content).length; j+=2)
      {
        // console.log("r",result.content);
          if(req.body.todo[i]==result.content[Object.keys(result.content)[j]])
          {
            result.content[Object.keys(result.content)[j+1]] = 1;
            // temp =1;
          }
      }
    }
    // console.log("raja",result);
    result.save();
    res.render("todo_update",{results :[result] , user : req.user});
  });


};
