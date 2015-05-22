// set up
var express  = require('express');
var app      = express();       // create our app w/ express
var morgan = require('morgan')
var bodyParser = require('body-parser')
var mongoose = require('mongoose'); // mongoose for mongodb

// configuration
// connect to mongoDB database on modulus.io
mongoose.connect('mongodb://localhost/todo');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// pull information from html in POST
app.use(bodyParser.json());
// simulate DELETE and PUT
// app.use(express.methodOverride());

// define model =================
var Todo = mongoose.model('Todo', {
  text : String
});


// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function(req, res) {

  // use mongoose to get all todos in the database
  Todo.find(function(err, todos) {

    // if there is an error retrieving, send the error.
    // nothing after res.send(err) will execute
    if (err)
      res.send(err)

    res.json(todos); // return all todos in JSON format
  });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  Todo.create({
    text : req.body.text,
    done : false
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    Todo.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
  Todo.remove({
    _id : req.params.todo_id
  }, function(err, todo) {
    if (err)
      res.send(err);

    // get and return all the todos after you create another
    Todo.find(function(err, todos) {
      if (err)
        res.send(err)
      res.json(todos);
    });
  });
});


// app
app.get('*', function(req, res) {
      // load the single view file
      // (angular will handle the page changes on the front-end)
  res.sendFile('/test.html');
});

// listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");
