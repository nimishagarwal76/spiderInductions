var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var notesSchema = new Schema({
    title: String,
    content: String,
    date : Object,
    label : String,
    edited : {type: Object ,default : new Date()},
    owner :[String],
    pictures : {type:[String] ,default : [""]},
    importance: Number
});

notesSchema.virtual('url').get(function () {
  return this._id ;
});


var Note = mongoose.model('notes',notesSchema);

module.exports = Note;
