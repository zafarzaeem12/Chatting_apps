const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRouter = require("./router/Users");
const ChatRouter = require("./router/Messages");
const GroupRouter = require("./router/Group");
const push_notifications = require('./middleware/push_notifications')
const MessageModal = require("./model/Messages");
const UserModal = require('./model/Users')
const {
  Getting_Messages,
  Sending_Messages,
  Sending_Group_Chat_Messages,
  Getting_Group_Chat_Messages,
} = require("./utils/chat");
app.use(express.json());
app.use(cors());

// routes start here
app.use("/UserAPI/", UserRouter);
app.use("/ChatAPI/", ChatRouter);
app.use("/GroupAPI/", GroupRouter);
// routes end here

dotenv.config();

const port = process.env.PORT;

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE_URL1)
  .then((res) => console.log(`Database connected successfully`))
  .catch((err) => console.log(`Database not connected `));
const messageHistory = {};
io.on("connection", (socket) => {
  socket.on("Getting_Messages", function (object) {
    // joining socket to room start here
    const senderID = object.sender_Id;
    const reciverID = object.reciever_Id;
    const room = `room person1 ${senderID} and person ${reciverID} `;
    socket.join(room);

    // joining socket to room end here

    Getting_Messages(object, async function (response) {
      //  console.log("responseive",response)
      // entering data into room start herw
      if (!messageHistory[socket.id]) {
        messageHistory[socket.id] = [];
      }
      messageHistory[socket.id].push(response);
      const lastMessage = getLastMessageFromSocket(socket.id);

      const last = await MessageModal.updateMany(
        { sender_Id: object.sender_Id, reciever_Id: object.reciever_Id },
        { last_conversation: lastMessage.at(-1) },
        { new: true }
      );

      io.to(room).emit("new_message", {
        object_type: "getting_message",
        message: { response, last },
      });
    });
    // entering data into room end here
  });

  socket.on("Sending_Messages", function (object) {
    const senderID = object.sender_Id;
    const reciverID = object.reciever_Id;
    const room = `room person1 ${senderID} and person ${reciverID} `;
    socket.join(room);

    Sending_Messages(object, async function (response) {
      // console.log("response",response)

      const receiver_object = await UserModal.find({ _id: object.reciever_Id });
      const sender_object = await UserModal.find({ _id: object.sender_Id });

      //console.log("receiver_object",receiver_object , "sender_object" , sender_object)

      let receiver_device_token = "";
      let receiver_name = "";
      let is_notification_reciever = " ";
      for (let i = 0; i < receiver_object.length; i++) {
        receiver_device_token = receiver_object[i].user_device_token;
        receiver_name = receiver_object[i].name;
        is_notification_reciever = receiver_object[i].is_notification;
      }

      let sender_device_token = "";
    let sender_name = "";
    let sender_image = "";
    // let sender_id = "";
    for (let i = 0; i < sender_object.length; i++) {
      sender_device_token = sender_object[i].user_device_token;
      sender_name = sender_object[i].name;
      sender_image = sender_object[i].user_image;
      // sender_id = sender_object[i]._id;
    }

    const notification_obj_receiver = {
      to: receiver_device_token,
      title: receiver_name,
      body: `${sender_name} has send you a message.`,
      notification_type: 'msg_notify',
      vibrate: 1,
      sound: 1,
      sender_id: object.sender_Id,
      sender_name: sender_name,
      sender_image: sender_image,
    };

    //console.log('object',notification_obj_receiver  , "receiver_object" , receiver_object.is_notification , "sender_object" , sender_object )

    if (receiver_object[0].is_notification === true) {
        // console.log("######" , receiver_object)
      push_notifications(notification_obj_receiver);
    }

      io.to(room).emit("new_message", {
        object_type: "sending_Messages",
        message: response,
      });
    });
  });

  socket.on("Sending_Group_Chat_Messages", (object) => {
    const Group_ID = object.group_Id;
    const room = `chatting room created in ${Group_ID}`;
    socket.join(room);

    Sending_Group_Chat_Messages(object, (res) => {
      io.to(room).emit("group_messages", {
        object_type: "group_messages",
        message: res,
      });
    });
  });

  socket.on("Getting_Group_Chat_Messages", (object) => {
    const Group_ID = object.group_Id;
    const room = `chatting room created in ${Group_ID}`;
    socket.join(room);

    Getting_Group_Chat_Messages(object, (res) => {
      io.to(room).emit("group_messages", {
        object_type: "group_messages",
        message: res,
      });
    });
  });
});

function getLastMessageFromSocket(socketId) {
  if (messageHistory[socketId]) {
    const messages = messageHistory[socketId];
    return messages[messages.length - 1];
  }
  return null;
}

http.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});
