const mongoose = require("mongoose")
const to_do_Schema = {
    task:{
        type: String,
        required: true
    },
    description:{
        type: String
    }
    ,createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userDB"
    }
}

const taskDb = mongoose.model("taskDB", to_do_Schema)

module.exports = {
    taskDb
}