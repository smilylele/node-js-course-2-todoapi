const expect = require("expect");
const request = require("supertest")

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb")

const todos = [{
    _id : new ObjectID(),
  text : "firt test todo"
}, {
    _id : new ObjectID(),
  text : "second test todo"
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
// When to use the done

