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

    // db.collection("Todos").find({completed : false}).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch the data", err)
    // });

    // Delete One

    // Delete Many
    // db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log("Unable to delete it", err);
    // })

    // Delete one and find
    db.collection("Todos").findOneAndDelete({completed : false}).then(result => {
        console.log(result);
    })
    // db.close();
} );
