/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");
const url = process.env.DB;
const Book = require('../Models/Book')

mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
    });

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      const allBooks = await Book.find({})
      res.json(allBooks)
    })
    
    .post(function (req, res) {
      if(!req.body.title) {
        res.send("missing required field title");
      } else {
        let title = req.body.title;
       
        let book = new Book({
          title: req.body.title,
          comments: [],
          commentcount: 0
        })

        book.save((err, data) => {
          res.json({
            _id: data['_id'],
            title: data.title,
          });
        })
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function (err) {
        if(err) {
          res.json(err);
        } else {
          res.json('complete delete successful');
        }
      });
    }); 



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      const regex = /^[0-9a-fA-F]{24}$/

      if (bookid.match(regex) == null) {           
        return res.send('no book exists');
      }

      let book = await Book.findById(bookid);

      if(book != null) {
        res.json({
          "_id": book["_id"], 
          "title": book.title, 
          "comments": book.comments
        })
      } else {
        return res.send('no book exists')
      }
    })
    
    .post(async function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      const regex = /^[0-9a-fA-F]{24}$/

      if (bookid.match(regex) == null) {          
        return res.send('no book exists');
      }

      let book = await Book.findById(bookid);

      if(book == null) {
        return res.send('no book exists');
      }

      if(comment == '' || comment == undefined) {
         return res.send('missing required field comment');
      }

      let newBook = {_id: book._id, title: book.title, "comments": [...book.comments, comment], "commentcount": book.commentcount + 1, __v: book.commentcount + 1}

      await Book.findByIdAndUpdate(bookid, {"comments": [...book.comments, comment], "commentcount": book.commentcount + 1, __v: book.commentcount + 1}, (err, oldBook) => {
        return res.json(newBook);
      });
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      const regex = /^[0-9a-fA-F]{24}$/

      if (bookid.match(regex) == null) {          
        return res.send('no book exists');
      }

      let deletedBook = await Book.findByIdAndDelete(bookid);

      if(deletedBook == null) {
        return res.send('no book exists');
      }

      return res.send('delete successful')
    
    });
  
};
