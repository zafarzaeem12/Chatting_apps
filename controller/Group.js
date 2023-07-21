const Group = require("../model/Group");
var mongoose = require("mongoose");
const Messages = require("../model/Messages");
const Create_Group = async (req, res, next) => {
  try {
    const groups = req?.file?.path?.replace(/\\/g, "/");
    const Create_Group = {
      group_name: req.body.group_name,
      group_messages: req.body.group_messages,
      group_members: req.body.group_members,
      group_image: groups,
      group_status: req.body.group_status,
      admin_Approval: req.body.admin_Approval,
      is_Admin: req.body.is_Admin,
    };
    if (Create_Group.group_status == "Private") {
      const new_Group = await Group.create(Create_Group);
      res.send({
        message: "send for Admin approval",
        status: 200,
        data: new_Group,
      });
    } else if (Create_Group.group_status == "Public") {
      const new_Group = await Group.create(Create_Group);
      res.send({
        message: "Group created Successfully",
        status: 200,
        data: new_Group,
      });
    }
  } catch (er) {
    res.send({
      message: "Group not found",
      status: 404,
    });
  }
};

const Requested_Members = async (req,res,next) => {

    const Group_ID = req.params.groupID
   
    const joining = {
        requested_member : req.body.requested_member,
        group_id : Group_ID,
        admin_Approval : req.body.admin_Approval
    }

   


    const groupdata = await Group.findOne({ _id : Group_ID })


    if(joining.group_id == Group_ID){
        groupdata.pending_request.push(joining)
    }

    const approved = await groupdata.save();

    res.send({ message : "waiting for admin approval" , data  : approved})

 }

const Admin_Approval = async (req, res, next) => {
    const Group_ID = req.query.groupID
    const Member_ID = req.query.Member_ID

    const data = await Group.updateOne(
        {
        _id : Group_ID
    } , {
        $pull : {  pending_request :{ requested_member : Member_ID }},
        $addToSet : { group_members :  Member_ID   }
    }  )


  res.send({
    message :"Requested Approved",
    status:200,
    data : data
  })
};

const Group_Chat_List = async (req,res) => {
    const group_Id = req.query.group_Id
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

      const Get_group_message = await Messages.aggregate(data);

      res.status(200).send({
        message : 'Group Fetched',
        data : Get_group_message
      })
}

module.exports = {
  Create_Group,
  Admin_Approval,
  Requested_Members,
  Group_Chat_List
};
