const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_New_Messages ,
    Get_Existing_User_Chatlist ,
    Show_Sender_And_Reciever_Messages
} = require('../controller/Messages')

router.post('/create_messages' , auth  , File.upload ,  Create_New_Messages);
router.get('/chatlist' , auth , File.upload , Get_Existing_User_Chatlist );
router.post( '/show_messages' , auth , File.upload , Show_Sender_And_Reciever_Messages );
module.exports = router