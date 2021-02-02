const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: true
    },
    commentcount: {
      type: Number,
      required: true
    }
  })
  
module.exports = mongoose.model('Book', bookSchema);