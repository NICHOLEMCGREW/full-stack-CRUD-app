const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
const TodoTask = require("./models/todotask");
require('dotenv').config();

// Set Middleware
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Connect to Mongo
mongoose.connect(process.env.DB_CONNECTION);

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error connecting to db:', err);
});

db.once('open', () => {
    console.log('Connected to db!');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

// GET METHOD
app.get("/", async (req, res) => {
    try {
        const tasks = await TodoTask.find({}).exec();
        res.render("index.ejs", { todoTasks: tasks });
    } catch (err) {
        console.error('Error in GET route:', err);
        res.status(500).send(err);
    }
});


// POST METHOD
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        title: req.body.title,
        content: req.body.content
    });
    try {
        await todoTask.save();
        console.log('Task saved:', todoTask);
        res.redirect("/");
    } catch (err) {
        console.error('Error saving task:', err);
        res.status(500).send(err);
    }
});

//EDIT OR UPDATE METHOD
app 
    .route("/edit:id")
    .get((req,res) => {
        const id = req.params.id
        TodoTask.find({}, (err,tasks) => {
            res.render('edit.ejs', {
                todoTasks:tasks, idTask: id
            })
        })
        .post((req,res) => {
            const id = req.params.id
            TodoTask.findByIdAndUpdate(
                id, 
                {
                    title: req.body.title,
                    content: req.body.content
                },
                err => {
                    if (err) return res.status(500).send(err)
                    res.redirect('/')
                }
            )
        })
    })

// DELETE
app.route("/remove/:id").get(async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTask = await TodoTask.findByIdAndDelete(id).exec();

        if (!deletedTask) {
            return res.status(404).send("Task not found");
        }

        console.log('Task deleted:', deletedTask);
        res.redirect('/');
    } catch (err) {
        console.error('Error in DELETE route:', err);
        res.status(500).send(err);
    }
});
