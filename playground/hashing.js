const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcryptjs");

var password = "123abc!";
bcrpyt.genSalt(10, (err, salt) => {
    bcrpyt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
})

var pw1 = "$2a$10$c7fvAjblfOv3CXtBnN0FCexHNAiZwNANFRk66yqatPQB7iEXMToY2"
var pw2 = "$2a$10$rY5uF1cB2F6WglSqXHwd4uLr/dY/vV3r/l7anbu3JbDixNbnvCaUu"

bcrpyt.compare(password, pw2, (err, res) => {
    console.log(res);
})
// var data = {
//     id :10
// }

// var token = jwt.sign(data, "123dfdk");
// console.log(token)
// var decoded = jwt.verify(token, "123dfdk")
// console.log(decoded)



// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id : 4
// };

// var token = {
//     data,
//     hash : SHA256(JSON.stringify(data)).toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + )
