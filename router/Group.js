const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_Group,
    Admin_Approval,
    Requested_Members,
    Group_Chat_List
} = require('../controller/Group')

router.post('/creategroup'   ,auth , File.group ,  Create_Group);
router.put('/adminapproval'   ,  Admin_Approval);
router.put('/joining_request/:groupID' , Requested_Members );
router.get('/group_chatlist' , Group_Chat_List )

module.exports = router