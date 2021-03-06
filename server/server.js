require('./config/config');

const _ = require("lodash");

const express = require("express");
const bodyParser = require("body-parser");

const {mongoose} =  require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");
const {User} = require("./models/user.js");
const {ObjectID} = require("mongodb")
var {authenticate} = require("./middleware/authenticate")
const bcrpyt = require("bcryptjs");

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
        text : req.body.text,
        _creator : req.user._id
    });

    todo.save().then((result) => {
        res.send(result);
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get("/todos", authenticate, (req, res) => {
    Todo.find({
        _creator : req.user._id
    }).then((result) => {
        res.send({result});
    }, (err) => {
        res.status(400).send(e);
    })
});

app.get("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    // if it is valid
    if (!ObjectID.isValid(id)) {
        // console.log("Not valid id!")
        return res.status(404).send();
    }

    Todo.findOne({
        _id : id,
        _creator : req.user._id
    }).then((result) => {
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

app.delete("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;
    // res.status(200).send(id);

    if (!ObjectID.isValid(id)) {
        // console.log("Not valid id!")
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id : id,
        _creator : req.user._id
    }).then((result) => {
        if (!result) {
            // console.log("no result back")
            return res.status(404).send();
        }

        res.status(200).send({result});

    }, (err) => {
        res.status(400).send()
    } )

})

app.patch("/todos/:id", authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({_id : id, _creator : req.user._id}, {$set : body}, {new : true}).then((result) => {
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

// POST /users/login
app.post("/users/login", (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header("x-auth", token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    })
})

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removetoken(req.token).then(() => {
        res.status(200).send();
    }), () => {
        res.status(400).send();
    }
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app}
