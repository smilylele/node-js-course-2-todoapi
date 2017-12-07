const {Todo} = require("./../../models/todo");
const {ObjectID} = require("mongodb")
const {User} = require("./../../models/user")
const jwt = require("jsonwebtoken")

const userOneId = new ObjectID();
const userSecondId = new ObjectID();
const users = [{
  _id : userOneId,
  email : "kanecccc@126.com",
  password : "JustFirstPwd",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id : userOneId, access : "auth"}, "abc123").toString()
  }]
}, {
  _id : userSecondId,
  email : "Chenfmmu@163.com",
  password : "JustSecondPwd",
  tokens:[{
    access: "auth",
    token: jwt.sign({_id: userSecondId, access: "auth"}, "abc123").toString()
  }]
}]

const todos = [{
    _id : new ObjectID(),
  text : "firt test todo",
  completed : true,
  completedAt: 34343,
  _creator : userOneId
}, {
    _id : new ObjectID(),
  text : "second test todo",
  completed : false,
  completedAt : null,
  _creator : userSecondId
}];

//beforeEach means do this function before every test
var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

var populateUsers = (done) => {
  User.remove({}).then(() => {
    // return User.insertMany(users);
    // Why don't we use the insertMany for users
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}
module.exports = {todos, populateTodos, users, populateUsers}
