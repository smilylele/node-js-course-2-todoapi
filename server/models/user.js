var mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

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

var User = mongoose.model("users", UserSchema);
module.exports = {User};
