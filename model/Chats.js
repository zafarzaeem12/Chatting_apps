const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    message: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Message'
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
module.exports = mongoose.model("Chat", ChatSchema);