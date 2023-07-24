const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_New_Messages ,
    Get_Existing_User_Chatlist ,
    Show_Sender_And_Reciever_Messages,
    Send_Media_Files
} = require('../controller/Messages')

router.post('/create_messages'   ,  Create_New_Messages);
router.get('/chatlist' , auth , File.upload , Get_Existing_User_Chatlist );
router.post('/show_messages' , auth , File.upload , Show_Sender_And_Reciever_Messages );
router.post('/media_files'  , File.upload , Send_Media_Files )
module.exports = router