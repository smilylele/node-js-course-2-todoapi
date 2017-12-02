var env = process.env.NODE_ENV || "development"
console.log("env *****", env);

if (env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp"
} else if (env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp_TEST"
}

const _ = require("lodash");

const express = require("express");
const bodyParser = require("body-parser");

const {mongoose} =  require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");
const {User} = require("./models/user.js");
const {ObjectID} = require("mongodb")
var {authenticate} = require("./middleware/authenticate")

var app = express();
const port = process.env.PORT;

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

// Todo.remove()
// Todo.findOneAndRemove
// Todo.findByIdAndRemove

app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;
    // res.status(200).send(id);

    if (!ObjectID.isValid(id)) {
        // console.log("Not valid id!")
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((result) => {
        if (!result) {
            // console.log("no result back")
            return res.status(404).send();
        }

        res.status(200).send({result});

    }, (err) => {
        res.status(400).send()
    } )

})

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((result) => {
        if (!result) {
            return res.status(404).send();
        }

        res.status(200).send(result);
    }).catch((e) => {
        res.status(400).send();
    })
})


app.post("/users", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).status(200).send(user)
    }).catch((e) => {
        res.status(400).send(e);
    })
})

// refer to "http://expressjs.com/en/guide/routing.html" for the Route Handler
// There are three ways to do this, or combination of them
app.get("/users/me", authenticate, (req, res) => {
    res.status(200).send(req.user)
})


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}
