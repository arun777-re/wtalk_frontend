import express from 'express';
import {  getMessageForChatId, getMessagesForUserId,sendMessageForChatId, sendMessageForRecId } from '../controllers/messageController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();
// router to send message based on recId
router.post('/:recId',verifyToken,sendMessageForRecId);

// router to send message based on chatId
router.post("/sendmessage/:chatId",verifyToken,sendMessageForChatId)

// dynamic route based on chatId and userId
router.get('/fetchmessage/:userId',verifyToken,getMessagesForUserId);

router.get('/allmessage/:chatId',verifyToken,getMessageForChatId);



export default router;