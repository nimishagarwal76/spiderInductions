var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
    content: Object,
    date : Object,
    owner : [String]
});

// notesSchema.virtual('url').get(function () {
//   return this._id ;
// });


var Todo = mongoose.model('todos',todoSchema);

module.exports = Todo;
