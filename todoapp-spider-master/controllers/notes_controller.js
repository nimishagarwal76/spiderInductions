var Note = require('../models/notes.js');
var Todo = require('../models/todo.js');
var upload = require('../app.js');
var User = require('../models/user.js');

exports.all_note = function(req, res)
{
  // console.log(req.session.passport.user);
  let query ={
    owner:req.user
  }
  Note.find(query).then(function(result){
    // console.log(result);
    // console.log(result[0].url);

    res.render('all_note',{data : result , user : req.user });
  });

};
exports.create_note_get = function(req,res){
    res.render("create_note", { user: req.user});
};

exports.lastedited = function (req, res){
  console.log(req.user);
    Note.find({owner:req.user},function(err, result){
      if (err) throw err;
      console.log("sasa",result);

      result.sort(function compare(a,b)
      {
      return a.edited.getTime() < b.edited.getTime();
    });

    console.log(result);

  res.render('all_note',{data : result , user : req.user });
    });
};

exports.importance = function (req, res){
  console.log(req.user);
    Note.find({owner:req.user},function(err, result){
      if (err) throw err;

      result.sort(function compare(a,b)
      {
      return a.importance < b.importance;
    });

    console.log(result);

  res.render('all_note',{data : result , user : req.user });
    });
};



exports.addimage = function(req, res){
  upload(req,res,function(err){
    if(err) throw err;
    if(req.file != undefined)
    {
      console.log("path:",req.file);
      Note.findById(req.params.id,function(err,note){
       if(err) throw err;
       note.pictures.push(req.file.destination+req.file.filename);
       note.save();
       console.log("note",note);
       console.log("na",req.params.user);

      });
  };
  res.redirect("/todoapp/"+req.params.user+'/note/'+req.params.id);
});
};


exports.create_note_post = function(req,res){

  console.log("body:",req.body);

  var note = new Note({
    title:req.body.title,
    content:req.body.content,
    date : new Date(),
    label : req.body.label,
    owner : [req.user],
    importance : req.body.importance
  });
  // console.log('_id',note._id);
  note.save();
  res.redirect('/todoapp/'+req.user+'/all_note');
};

exports.search = function (req, res){
  console.log(req.body);
  // res.send('f');
  let query = { label : req.body.label};
  Note.find(query).then(function(result){
    // console.log(result);
    // console.log(result[0].url);
    res.render('all_note',{data : result , user : req.user });
  });
};

exports.collab = function(req,res){
  console.log(req.body);
  console.log(req.params.id);

  Note.findById(req.params.id,function(err,note){
      if(err) throw err;
      User.findOne({username: req.body.owner}, function(err,user){
        if(err) throw err;
        if(user)
      {
        note.owner.push(req.body.owner);
        note.save();
        res.redirect("/todoapp/"+req.user+"/note/"+req.params.id);
      }
      else{

        res.redirect("/todoapp/"+req.user+"/note/"+req.params.id);
      }
    });
  });

  // res.send('done');
};

exports.collabremove = function(req,res){
  User.findOne({username:req.body.owner}, function(err,user){
   if(err) throw err;
   if(user)
   {
    Note.findById(req.params.id,function(err,note){
     if(err) throw err;
     note.owner = note.owner.filter(function(collab) {
       return collab != req.body.owner;
     });
     note.save();
     console.log(note.owner);

    });
  }
  res.redirect("/todoapp/"+req.user+"/note/"+req.params.id);
});
};


exports.note_detail = function(req,res){
  let query = {_id : req.params.id};
  // console.log(query);
  Note.findOne(query).then(function(result){
   res.render("note_details",{data : result, user: req.user, id: req.params.id});
   // console.log(result);
 });};

exports.note_delete = function(req,res){
  let query = {_id : req.params.id};
  Note.deleteOne(query).then(res.redirect('/todoapp/'+req.user+'/all_note'));
};

exports.note_update_get = function(req,res){
  let query = {_id : req.params.id};
  Note.findOne(query).then(function(result){res.render('note_update',{data:result, user: req.user});});
};

exports.note_update_post = function(req,res){
  console.log(req.body);
    Note.findById(req.params.id,function(err,note){
     if(err) throw err;
     note.title = req.body.title;
     note.content=req.body.content;
     note.label = req.body.label;
     note.edited = new Date();
     note.save();
     // console.log(note.owner);
     res.redirect("/todoapp/"+req.user+"/note/"+req.params.id);
    });



};
