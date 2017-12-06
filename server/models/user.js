var mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrpyt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
    email : {
        required : true,
        trim: true,
        type: String,
        minlength: 1,
        unique : true,
        validate : {
            validator : (value) => {
                return validator.isEmail(value);
            },
            message :  "{VALUE} is not a valid email"
        }
    },

    password : {
        required : true,
        type : String,
        minlength : 6,
    },
    tokens : [{
        access : {
            type: String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ["_id", "email"])
}

UserSchema.methods.generateAuthToken = function () {
    var user = this; // What does "this" mean? an instance of UserSchema? or the function. From the context, it is like the instance of model rather than the UserSchema
    var access = "auth";
    var token = jwt.sign({_id : user._id.toHexString(), access}, "abc123").toString()

    user.tokens.push({access, token}); // What does it mean by push to an array? after checking the array, that means append

    return user.save().then(() => {
        return token; // Return in a wrapped function, which container can take that?
    });
    }

UserSchema.statics.findByToken = function (token) {
    // Why use statics here
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, "abc123")
    } catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        return Promise.reject();
        }

    return User.findOne({
        "_id" : decoded._id,
        "tokens.token" : token,
        "tokens.access" : "auth"
    })
}

UserSchema.statics.findByCredentials = function(email, password){
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrpyt.compare(password, user.password, (err, res) => {
                if (res) {
                    return resolve(user);
                } else {
                    return reject();
                }
            })
        })
    })
}

UserSchema.methods.removetoken = function (token) {
    var user = this;
    var decoded;

    return user.update({
        $pull : {
            tokens: {
                token: token
            }
        }
    })
};

// Why put the middleware here?
UserSchema.pre("save", function (next) {
    var user = this;

    if (user.isModified("password")) { // user.isModified? how you can know they are isModified?
        // after reading some questions answers, I get this:
            // ismodiefied is check if the data has been changed since the data was fectched for the database
            // but for a new instance, the isModified will always return "True"
        // But in this video, I stll can't see the sense of user.isModified with all the explanations!
        bcrpyt.genSalt(10, (err, salt) => {
            bcrpyt.hash(user.password, salt, (err, hash) => {
                // var oldpassword = user.password
                user.password = hash;// if we have a wrong password, it will change my password in the database?
                // bcrpyt.compare(oldpassword, user.password, (err, res) => {
                //     console.log("yes");
                // })
                next();
            })
        })
    } else {
        next();
    }
} )

var User = mongoose.model("users", UserSchema);
module.exports = {User};
