const expect = require("expect");
const request = require("supertest")

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb")
const {User} = require("./../models/user")

const {todos, populateTodos, users, populateUsers} = require("./seed/seed.js")

//beforeEach means do this function before every test
beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text =  "Test todo text";

        request(app).post("/todos").send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            })
        })
    })

    it("should return nothing", (done) =>{
        request(app)
        .post("/todos")
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {done(e)})
        })
    })
});

describe("GET /todos", () => {
  it("should get all the data back", (done) => {
    request(app)
    .get("/todos")
    .expect(200)
    .expect((res) => {
      expect(res.body.result.length).toBe(2)
    })
    .end(done);
    });
  });

describe("GET /todos/:id", () => {
    it("should get the specific todo document", (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.result.text).toBe(todos[0].text);
        })
        .end(done);
    })

    it("should return 404 if to do not found", (done) => {
        var changed_id = todos[0]._id.toHexString().replace("a", "e")
      request(app)
      .get(`/todos/${changed_id}`)
      .expect(404)
      .end(done);
    })

    // it("should return 404 if the id is not valid", (done) => {
    //     var changed_id = todos[0]._id.toHexString().replace("a", "e")
    //     request(app)
    //     .get(`/todos/${changed_id}`)
    //     .expect(404)
    //     .end(done)
    // })


    it("should return 404 again", (done) => {
        var changed_id = todos[0]._id.toHexString().replace("a", "e")
      request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
    })
})

describe("DELETE /todos/:id", () => {
    it("Should remove one doc", (done) => {
        request(app)
        .delete(`/todos/${todos[0]._id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.result.text).toBe("firt test todo")
        })
        .end(done);
    })

    it("Should return 404 with invalid id", (done) => {
        request(app)
        .delete("/todos/djfkdfjdk")
        .expect(404)
        .end(done)
    });

    it("Should return 400 if not found", (done) => {
        var changed_id = todos[0]._id.toHexString().replace("a", "e")
        request(app)
        .delete(`/todos/${changed_id}`)
        .expect(404)
        .end(done)
    })
})
// When to use the done, 20171127 19:59:02

describe("Patch /todos/id", () => {
    it("Should patch a doc successfully", (done) => {
        var second_id = todos[1]._id.toHexString();
        var newtext = "This should be new one";

        request(app)
        .patch(`/todos/${second_id}`)
        .send({
            completed : true,
            text : newtext
        })
        .expect(200)
        .expect((result) =>{
            expect(result.body.text).toBe(newtext)
            expect(typeof result.body.completedAt).toBe("number")
        })
        .end(done)
    })

    it("Should clear completedAt when todo is not completed", (done) => {
        var first_id = todos[0]._id.toHexString();

        request(app)
        .patch(`/todos/${first_id}`)
        .send({
            completed : false
        })
        .expect(200)
        .expect((result) => {
            expect(result.body.completed).toBeFalsy()
            expect(result.body.completedAt).toBeNull()
        })
        .end(done)
    })
})


describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
        .get("/users/me")
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    })

    it("should return 401 if authenticated", (done) => {
        request(app)
        .get("/users/me")
        .set("x-auth", "this is just a joke")
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    })
});

describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "lele@163.com";
        var password = "3647867";

        request(app)
        .post("/users")
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers["x-auth"]).toBeDefined();
            expect(res.body.email).toBe(email);
            expect(res.body._id).toBeDefined();
        }).end((err) => {
            if (err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeDefined();
                expect(user.password).not.toEqual(password);
                done();
            })
        })

    });

    it("should return validation errors if request invalid", (done) => {
        var password = "343"
        request(app)
        .post("/users")
        .send({email : "nothing", password})
        .expect(400)
        .expect((res) => {
            expect(res.body.errors.email).toBeDefined();
            expect(res.body.errors.password.kind).toBe("minlength");
        }).end(done);
    });

    it("should not create user email in use", (done) => {
        var password = "34934934034";
        request(app)
        .post("/users")
        .send({email : users[0].email, password})
        .expect((res) => {
            expect(res.body.code).toBe(11000);
        }).end(done)
    })
});

describe("Test POST /users/login", () => {
    it("should return the user value", (done) => {
        request(app)
        .post("/users/login")
        .send({email : users[0].email, password : users[0].password})
        .expect(200)
        .expect((res) => {
            // expect(res.body.email).toBe(users[0].email);
            expect(res.headers["x-auth"]).toBeDefined();
        }).end((err, res) => {
            if (err) {
                return done(err)
            }

            User.findById(users[0]._id).then((user) => {
                expect(user[0].tokens).toContain({
                    access : "auth",
                    token : res.headers["x-auth"]
                })
            })

            done();
        })
    })

    it("should return nothing for a wrong password", (done) => {
        request(app)
        .post("/users/login")
        .send({email : users[0].email, password : "nothingpossible"})
        .expect(400)
        .end(done)
    })
})

describe("Test DELETE /users/login/token", () => {
    it("should remove all the token", (done) => {
        request(app)
        .delete("/users/me/token")
        .set("x-auth", users[0].tokens[0].token) // why use set here
        .expect(200)
        .end((err, result) => {
            if (err) {
                return done(err);
            }

            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done();
            }).catch((e) => done(e))
        })
    })
})
