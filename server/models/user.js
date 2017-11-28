var mongoose = require("mongoose")
var validator = require("validator")

var User = mongoose.model("users", {
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
        }
    }, {
        tokens : {
            type : String,
            required : true
        }
    }]
    })
module.exports = {User};
