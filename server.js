const express = require("express");
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRouter = require("./router/Users");
const ChatRouter = require("./router/Messages");
const GroupRouter = require('./router/Group');

const {Getting_Messages , Sending_Messages ,Sending_Group_Chat_Messages ,Getting_Group_Chat_Messages} = require('./utils/chat')
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

  io.on('connection' , (socket ) => {


    socket.on('Getting_Messages',function(object){

      // joining socket to room start here
      const senderID = object.sender_Id
      const reciverID = object.reciever_Id
      const room = `room person1 ${senderID} and person ${reciverID} `
      socket.join(room)
      // joining socket to room end here

      Getting_Messages(object,function(response){
        //  console.log("responseive",response)
      // entering data into room start herw
        io.to(room).emit("new_message",{
            object_type:"getting_message",
            message:response
        })

      })
       // entering data into room end here
    })
    
    socket.on('Sending_Messages',function(object){
  
      const senderID = object.sender_Id
      const reciverID = object.reciever_Id
      const room = `room person1 ${senderID} and person ${reciverID} `
      socket.join(room)

      Sending_Messages(object,function(response){
        // console.log("response",response)

        io.to(room).emit("new_message" , {
          object_type : "sending_Messages",
          message : response
        } )

      })
    })

    socket.on('Sending_Group_Chat_Messages',((object) => {
      const Group_ID = object.group_Id
      const room = `chatting room created in ${Group_ID}`
      socket.join(room)

      Sending_Group_Chat_Messages(object ,(res) => {
        io.to(room).emit("group_messages" , {
          object_type : "group_messages",
          message : res
        } )
      })


    }))

    socket.on('Getting_Group_Chat_Messages',((object) => {
      const Group_ID = object.group_Id
      const room = `chatting room created in ${Group_ID}`
      socket.join(room)

      Getting_Group_Chat_Messages(object ,(res) => {
        io.to(room).emit("group_messages" , {
          object_type : "group_messages",
          message : res
        } )
      })


    }))



  });



  http.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});
