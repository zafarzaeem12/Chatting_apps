const Message = require("../model/Messages");
var mongoose = require("mongoose");
const Getting_Messages = async (object , callback) => {
    const sender = object.sender_Id;
    const reciever = object.reciever_Id;
    if(sender == object.sender_Id &&  reciever == object.reciever_Id){
        const get_data = await Message.find({ $or:[{sender_Id : sender } , {reciever_Id : reciever  }]   })
        callback(get_data)
    }else if(reciever == object.sender_Id &&  sender == object.reciever_Id){
        const get_data = await Message.find({ $or:[{sender_Id : reciever } , {reciever_Id : sender  }]   })
        callback(get_data)
    }
}

const Sending_Messages = async (object , callback) => {
    // const attachments = req?.files?.chat_attachment?.map((data) =>
    //   data?.path?.replace(/\\/g, "/")
    // );
    try {
      const messages = {
        message: object.message,
        chat_attachment: object.chat_attachment,
        sender_Id: object.sender_Id,
        reciever_Id: object.reciever_Id,
      };
     
      const chats = await Message.create(messages);

      callback(chats)
    //   res.send({
    //     messages: "chat created",
    //     status: 200,
    //     data: chats,
    //   });
    } catch (err) {
        callback(err)
    //   res.send({
    //     messages: "No chat created",
    //     status: 404,
    //   });
    }
  };
  
  const Getting_Group_Chat_Messages = async (object , callback) => {
    const group_Id = object.group_Id
    const id = mongoose.Types.ObjectId(group_Id);
    const data =   [
        {
          '$match': {
            'group_Id': id
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'sender_Id', 
            'foreignField': '_id', 
            'as': 'sender_Data'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'reciever_Id', 
            'foreignField': '_id', 
            'as': 'reciever_Data'
          }
        }, {
          '$unwind': {
            'path': '$sender_Data'
          }
        }, {
          '$unwind': {
            'path': '$reciever_Data'
          }
        }, {
          '$unset': [
            'sender_Data.dob', 'sender_Data.verification_code', 'sender_Data.is_verified', 'sender_Data.user_is_profile_complete', 'sender_Data.user_is_forgot', 'sender_Data.user_authentication', 'sender_Data.user_device_token', 'sender_Data.user_device_type', 'sender_Data.is_profile_deleted', 'sender_Data.is_notification', 'sender_Data.is_Blocked', 'sender_Data.createdAt', 'sender_Data.updatedAt', 'sender_Data.password'
          ]
        }, {
          '$unset': [
            'reciever_Data.dob', 'reciever_Data.verification_code', 'reciever_Data.is_verified', 'reciever_Data.user_is_profile_complete', 'reciever_Data.user_is_forgot', 'reciever_Data.user_authentication', 'reciever_Data.user_device_token', 'reciever_Data.user_device_type', 'reciever_Data.is_profile_deleted', 'reciever_Data.is_notification', 'reciever_Data.is_Blocked', 'reciever_Data.createdAt', 'reciever_Data.updatedAt', 'reciever_Data.password'
          ]
        }, {
          '$sort': {
            'createdAt': -1
          }
        }
      ]

      const Get_group_message = await Message.aggregate(data);
      callback(Get_group_message)
  }


const Sending_Group_Chat_Messages = async (object , callback) => {
    try {
        const messages = {
          message: object.message,
         // chat_attachment: attachments,
          sender_Id: object.sender_Id,
          reciever_Id: object.reciever_Id,
          group_Id : object.group_Id
        };
       
        const chats = await Message.create(messages);
  
        callback(chats)
      //   res.send({
      //     messages: "chat created",
      //     status: 200,
      //     data: chats,
      //   });
      } catch (err) {
          callback(err)
      //   res.send({
      //     messages: "No chat created",
      //     status: 404,
      //   });
      }
}

module.exports={
    Getting_Messages,
    Sending_Messages,
    Getting_Group_Chat_Messages,
    Sending_Group_Chat_Messages
}