var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const PORT = 3000;

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', './views');

//Models
//const Todo = require("./models/Todo");

//DB Connection 
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to db");
});

const todoSchema = mongoose.Schema({
    todoTitle: String, 
    todoActive: String
});

const Todo = mongoose.model('Todo', todoSchema);
const todoTitle = 'test todo';
const todoActive = 'true';

app.get('/', function(req,res) {
    res.render('index.ejs');
})

app.post('/', upload.fields([]), function(req, res){
    const formData = req.body;
    console.log('formData', formData);  
    const todoTitle = req.body.todoTitle;
    const todoActive = req.body.todoActive;
    console.log(todoTitle);
    const newTodo = new Todo({todoTitle: todoTitle, todoActive: todoActive});
    newTodo.save((err, savedTodo) => {
        if(err){
            console.error(err);
        }else {
            console.log('savedTodo', savedTodo);
        }
    })
    res.sendStatus(201);
});

app.get('/todos', function(req,res) {
    const todos = [];
    Todo.find((err, todos) => {
        if(err){
            console.error('Could not load todos');
            res.sendStatus(500);
        }else {
            todos = todos
            res.render('todos', {todos: todos});
        }
    })
})

app.get('/todosAsync', async (req,res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch(message){
        res.status(500).send({message});
    }
})

app.listen(PORT, function () {
    console.log('App listening on port '+PORT+' !')
});