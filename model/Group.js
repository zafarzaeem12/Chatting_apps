const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({

    group_name : {
        type : String
    },
    group_messages: {
        type : String
    },
    group_members: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    group_image: {
        type : String
    },
    group_status:{
        type:String,
        enum : ['Public','Private'],
        default: 'Public'
    },
    admin_Approval : {
        type : Boolean,
        default : false
    },
    is_Admin:{
        type : Boolean,
        default : false
    },
    requested_member:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    pending_request:{
        type : Array,
        default : []
    }
   
},
    { timestamps: true }
)
module.exports = mongoose.model("Group", GroupSchema);