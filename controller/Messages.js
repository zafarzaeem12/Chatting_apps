const Message = require("../model/Messages");
var mongoose = require("mongoose");
const io = require("socket.io");
const Create_New_Messages = async (req, res, io) => {
  const attachments = req?.files?.chat_attachment?.map((data) =>
    data?.path?.replace(/\\/g, "/")
  );
  try {
    const messages = {
      message: req.body.message,
      chat_attachment: attachments,
      sender_Id: req.body.sender_Id,
      reciever_Id: req.body.reciever_Id,
    };
    const chats = await Message.create(messages);
    io.emit("chats", chats);
    res.send({
      messages: "chat created",
      status: 200,
      data: chats,
    });
  } catch (err) {
    res.send({
      messages: "No chat created",
      status: 404,
    });
  }
};

const Get_Existing_User_Chatlist = async (req, res, next) => {
  const reciever_ID = req.id;
  const id = mongoose.Types.ObjectId(req.id);
  const ids = mongoose.Types.ObjectId(reciever_ID);
  try {
    const data = [
      {
        '$match': {
          '$or': [
            {
              'sender_Id': id
            }, {
              'reciever_Id': ids
            }
          ]
        }
      }, {
        '$unset': [
          'message', 'chat_attachment', 'sender_Id', 'group_Id', 'updatedAt', '__v', '_id'
        ]
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'reciever_Id', 
          'foreignField': '_id', 
          'as': 'reciever_data'
        }
      }, {
        '$unwind': {
          'path': '$reciever_data'
        }
      }, {
        '$unset': [
          'reciever_data.verification_code', 'reciever_data.is_verified', 'reciever_data.user_is_profile_complete', 'reciever_data.user_is_forgot', 'reciever_data.user_authentication', 'reciever_data.user_device_token', 'reciever_data.user_device_type', 'reciever_data.is_profile_deleted', 'reciever_data.is_notification', 'reciever_data.is_Blocked'
        ]
      }, {
        '$sort': {
          'createdAt': -1
        }
      }
    ]

    const related_chats = await Message.aggregate(data);
    res.send({
      message: "Data Fetched",
      status: 200,
      data: related_chats,
    });
  } catch (err) {
    console.log(err);
  }
};

const Show_Sender_And_Reciever_Messages = async (req, res, next) => {
  const reciever_ID = req.query.reciever_Id;
  const sender_ID = req.id;
  const id = mongoose.Types.ObjectId(sender_ID);
  const ids = mongoose.Types.ObjectId(reciever_ID);

  try {
    const data = [
      {
        $match: {
          sender_Id: id,
          reciever_Id: ids,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_Id",
          foreignField: "_id",
          as: "sender_Data",
        },
      },
      {
        $unwind: {
          path: "$sender_Data",
        },
      },
      {
        $unset: [
          "sender_Data.password",
          "sender_Data.verification_code",
          "sender_Data.is_verified",
          "sender_Data.user_is_profile_complete",
          "sender_Data.user_is_forgot",
          "sender_Data.user_authentication",
          "sender_Data.user_device_token",
          "sender_Data.user_device_type",
          "sender_Data.is_profile_deleted",
          "sender_Data.is_notification",
          "sender_Data.is_Blocked",
          "sender_Data.createdAt",
          "sender_Data.updatedAt",
        ],
      },
      {
        $lookup: {
          from: "users",
          localField: "reciever_Id",
          foreignField: "_id",
          as: "Reciever_Data",
        },
      },
      {
        $unwind: {
          path: "$Reciever_Data",
        },
      },
      {
        $unset: [
          "Reciever_Data.password",
          "Reciever_Data.verification_code",
          "Reciever_Data.is_verified",
          "Reciever_Data.user_is_profile_complete",
          "Reciever_Data.user_is_forgot",
          "Reciever_Data.user_authentication",
          "Reciever_Data.user_device_token",
          "Reciever_Data.user_device_type",
          "Reciever_Data.is_profile_deleted",
          "Reciever_Data.is_notification",
          "Reciever_Data.is_Blocked",
          "Reciever_Data.createdAt",
          "Reciever_Data.updatedAt",
        ],
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const peer_to_peer = await Message.aggregate(data);
    res.send({
      message: "Data fetched Successfully",
      status: 200,
      data: peer_to_peer,
    });
  } catch (err) {
    res.send({
      message: "Data Not fetched",
      status: 404,
    });
  }
};

module.exports = {
  Create_New_Messages,
  Get_Existing_User_Chatlist,
  Show_Sender_And_Reciever_Messages,
};
