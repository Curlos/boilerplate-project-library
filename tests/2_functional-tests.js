/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1;
let id2;

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'Harry Potter'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id', 'Posted book should contain _id');
          assert.equal(res.body.title, 'Harry Potter');

          id1 = res.body._id;
          console.log('New id: ', id1);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: "" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function() {
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + id1)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body._id, id1);
          assert.equal(res.body.title, 'Harry Potter');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + id1)
        .send({ comment: "this book sucks" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.comments[0], 'this book sucks');
          assert.equal(res.body.commentcount, 1);
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/' + id1)
        .send({ comment: "" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/' + 'invalidid')
        .send({ comment: "this book sucks" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete("/api/books/" + id1)
          .send({
              _id: id1
            })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete("/api/books/" + 'invalidid')
          .send({
              _id: id1
            })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
        });
      });

    });

  });

});
