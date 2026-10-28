const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String, required: true
    },
    userName:{
        type: String, required: true, lowerCase: true, trim: true
    },
    age: {
        type: String, required: true
    },
    role:{
        type: String, enum: ["user", "artist"], default: "user"
    },
    email: {
        type: String, required: true, unique: true, lowerCase: true, trim: true
    },
    password: {
        type: String, required: true
    }
})
const userModel =  mongoose.model("user", userSchema)
module.exports = userModel