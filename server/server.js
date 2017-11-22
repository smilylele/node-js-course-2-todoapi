var mongoose = require("mongoose")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model("Todo", {
    text: {
        type: String
    },
    completed: {
        type : Boolean
    },
    completedAt : {
        type: Number
    }
})

// var newTodo = new Todo({
//     text: "Cook Dinner"
// })

// newTodo.save().then((result) => {
//     console.log("Saved todo", result);
// }, (err) => {
//     console.log("Unable to save todo")
// })

var newTodo = new Todo({
    text : "This is a new saved one",
    completed : true,
    completedAt : 201711230652
})

newTodo.save().then((result) => {
    console.log("saved todo", result);
}, (err) => {
    console.log("Unable todo");
})
// save new something

