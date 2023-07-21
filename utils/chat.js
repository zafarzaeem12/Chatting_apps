const Message = require("../model/Messages");

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
    //);
    try {
      const messages = {
        message: object.message,
       // chat_attachment: attachments,
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
  

module.exports={
    Getting_Messages,
    Sending_Messages
}