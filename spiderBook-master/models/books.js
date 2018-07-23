var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookSchema = new Schema({
    id: String,
    like: {
      type:Number,
      default:0
    },
    comment : [{
      user:String,
      text:String,
    }],
});


var Book = mongoose.model('books', bookSchema);

module.exports = Book;
