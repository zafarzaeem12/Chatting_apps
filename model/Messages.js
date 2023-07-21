const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    chat_attachment : {
        type: Array
    },
    sender_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reciever_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    group_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Group'
    }
},
    { timestamps: true }
)
module.exports = mongoose.model("Message", MessageSchema);