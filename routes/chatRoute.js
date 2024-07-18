import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
import { accessChat, addToGroup, createGroupChat, fetchChats, removeUser, renameGroup } from '../controllers/chatController.js';


const router = express.Router();

// access chat of the chat room
router.post('/',verifyToken,accessChat);
router.get('/fetchchat',verifyToken,fetchChats);
router.post('/groupchat',verifyToken,createGroupChat);
router.patch('/updatechat',verifyToken,renameGroup);
router.patch('/addtochat',verifyToken,addToGroup);
router.patch('/removetochat',verifyToken,removeUser);

export default router;

