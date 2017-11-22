// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

// var user = {name : "ChenChen", age: 25};
// var {age} = user
// console.log(age)

var obj = new ObjectID();
console.log(obj.getTimestamp());

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err) {
        return console.log("Unable to connect to Mongodb server!");
    }
    console.log("Connect to the Mongodb server!");


    // db.collection("Todos").findOneAndUpdate(
    //     {_id : new ObjectID("5a13e4914ec2f7c73b117950")},
    //     { $set : {
    //         completed : true
    //     }} , {
    //         returnOriginal : false
    //     }).then((result) => {
    //     console.log(result);
    // });

    // add one
    db.collection("Users").findOneAndUpdate(
        {_id : ObjectID("5a1594912847e42344aeef70")},
        {$inc : {age : 1}},
        {returnOriginal : false}
    ).then((result) => {console.log(result)})
    });
