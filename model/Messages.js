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
},
    { timestamps: true }
)
module.exports = mongoose.model("Message", MessageSchema);