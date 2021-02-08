const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    todoTitle: String, 
    todoActive: String
});