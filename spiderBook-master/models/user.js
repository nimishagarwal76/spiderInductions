var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var bookSchema = new Schema({
    id: String,
    like: {type:Boolean, default:false},
    comment: [String],
    rate: {type:Number, default:undefined},
    status: {type:String, default:undefined},
    favourite: {type:Boolean, default:false}
});

var activitySchema = new Schema({
  id : String,
  type : String,
  title : String
});

var statusSchema = new Schema({
  id:String,
  img:String,
  title:String
});

var userSchema = new Schema({
    username:String,
    password: String,
    email : String,
    name : String,
    want : [statusSchema],
    reading : [statusSchema],
    read : [statusSchema],
    favourite : [statusSchema],
    friend : {type:Array},
    request : {type:Array},
    book : [bookSchema],
    activity : [activitySchema]
});

var User = mongoose.model('users',userSchema);

module.exports = User;
