var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} =  require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");
const {ObjectID} = require("mongodb")

var app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    var todo = new Todo({
        text : req.body.text
    });

    todo.save().then((result) => {
        res.send(result);
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get("/todos", (req, res) => {
    Todo.find().then((result) => {
        res.send({result});
    }, (err) => {
        res.status(400).send(e);
    })
});

app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    // if it is valid
    if (!ObjectID.isValid(id)) {
        // console.log("Not valid id!")
        return res.status(404).send();
    }

    Todo.findById(id).then((result) => {
        if (!result) {
            return res.status(404).send({message : `Nothing found for this id as ${id}`})
        }
        res.status(200).send({result});
    }, (err) => {
        res.status(400).send(err)
    })

})

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {app}
