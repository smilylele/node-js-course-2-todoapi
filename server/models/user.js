var mongoose = require("mongoose")

var User = mongoose.model("users", {
    email : {
        required : true,
        trim: true,
        type: String,
        minlength: 1
    }
})
module.exports = {User};
