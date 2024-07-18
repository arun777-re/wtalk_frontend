import Message from "../models/Message.js";
import Chat from "../models/chatModel.js";
import User from "../Models/User.js";
import mongoose from "mongoose";


export const getMessageForChatId = async(req,res)=>{
  try {
    const {chatId} = req.params;

    console.log(chatId);
    if(!chatId){
      return res.status(404).json("Invalid data sent")
    }

    const messages = await Message.find({chat:chatId})
    .populate("sender","firstName email userPicture")
    .populate("chat");

    if(!messages && messages?.length === 0){
      return res.status(404).json("No message found related to this chatId")

    }

    console.log("messages",messages)

    return res.status(200).json(messages)

  } catch (error) {
    console.error(error)
    return res.status(500).json("Internal Server Error")
  }
}

export const getMessagesForUserId = async(req,res)=>{
  try {
    const {userId} = req.params;

    console.log(userId);
    if(!userId){
      return res.status(404).json("Invalid data sent")
    }
     
    const chatroom = await Chat.find({users:{$in:[userId]}})
    console.log("chatroom:",chatroom)
    const chatroomId = chatroom[0]?._id;

    const messages = await Message.find({chat:chatroomId})
    .populate("sender","firstName email userPicture")
    .populate("chat");

    if(!messages && messages?.length === 0){
      return res.status(404).json("No message found related to this chatId")

    }
    console.log("messages",messages);
    return res.send(messages)


    // return res.status(200).json(messages)


  } catch (error) {
    console.error(error)
    return res.status(500).json("Internal Server Error")
  }
}

export const sendMessageForRecId = async (req, res) => {
  try {
    const text = req.body.text;
    const {recId} = req.params;
  

    if (!text || !recId) {
      return res.status(400).json({ mesage: "Invalid data passed into req" });
    }

    let chatroom = await Chat.findOne({
      users: { $all: [recId, req.user._id] },
    });
    if (!chatroom) {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [recId, req.user._id],
      };
      chatroom = await Chat.create(chatData);
    }

    let newMessage = {
      sender: req.user._id,
      text: text,
      chat: chatroom._id,
    };

    let message = await Message.create(newMessage);
    message = await message.populate("sender", "firstName userPicture");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName userPicture email",
    });

    await Chat.findByIdAndUpdate(chatroom._id, {
      latestMessage: message,
    });
    // Log chatId and message after update

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const sendMessageForChatId = async(req,res)=>{
  try {
    const {chatId} = req.params;
    const text = req.body.text;
    console.log(text)
    console.log(chatId)
    
    if(!chatId){
      return res.status(404).json("chatId not found")
    }
     

    let newMessage = {
      sender:req.user._id,
      text:text,
      chat:chatId
    }

    let message = await Message.create(newMessage)
 message = await message.populate("sender","firstName email userPicture")
 message = await message.populate("chat")
  
message = await User.populate(message,{
  path:"chat.users",
  select:"firstName userPicture email"
})

const chatroom = await Chat.findByIdAndUpdate(chatId,{
  $addToSet:{latestMessage:message}
});

res.status(201).json(message)
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error")
  }
}