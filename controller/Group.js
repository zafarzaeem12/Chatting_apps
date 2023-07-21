const Group = require("../model/Group");

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

module.exports = {
  Create_Group,
  Admin_Approval,
  Requested_Members
};
