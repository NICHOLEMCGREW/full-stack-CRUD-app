const mongoose = require('mongoose')
const todoTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false 
    },
    date: {
        type: Date, 
        default: Date.now
    }
})
module.exports = mongoose.model('TodoTask', todoTaskSchema, 'tasks')