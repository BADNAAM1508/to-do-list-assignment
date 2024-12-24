const mongoose = require("mongoose")
const userSchema = {
    email:{
        required:true,
        type: String
    },
    phone:{
        required:true,
        type:Number
    },
    password:{
        required:true,
        type:String
    },
    confirm_password:{
        required:true,
        type:String
    }
}

const userDb = mongoose.model("userDB", userSchema)

module.exports = {
    userDb
}