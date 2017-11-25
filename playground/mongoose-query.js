const {mongoose} = require("./../server/db/mongoose")
const {Todo} = require("./../server/models/todo")
const {ObjectId} = require("mongodb")

var id = "6a1941c42ef36f2408ec88e2e"

if (!ObjectId.isValid(id)) {
    return console.log("ID not valid");
}
// Todo.find({
//     _id : id
// }).then((result) => {
//     console.log("Todos", result)
// });

// Todo.findOne({
//     _id : id
// }).then((result) => {
//     console.log("Todos", result)
// });
// // findOne give back one item


Todo.findById(id).then((result) => {
    if (!result) {
        return console.log("id not found")
    }
    console.log("Todo by ID", result)
}).catch((e) => {
    console.log(e )
})
