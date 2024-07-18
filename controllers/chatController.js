import Chat from "../models/chatModel.js";
import User from "../Models/User.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
 console.log(userId)
    if (!userId) {
      console.log("UserId param not sent with req");
      return res.status(400).json("userId not sent");
    }

    // $and operator is opposite of $or operator
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "firstName userPicture email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
    }

    const createdChat = await Chat.create(chatData);

    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
   console.log(chatName);
    return res.send(FullChat)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const fetchChats = async (req, res) => {
  try {
    // find the chat related to the logged in user
    const userId = req.user._id;
    Chat.find({ users: { $elemMatch: { $eq: userId} } })
    .populate("users","firstName userPicture").then((result)=>{
      console.log(result.length)
      res.send(result);
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const createGroupChat = async (req, res) => {
  const {users,name} = req.body;
  console.log(users,name)
  if (!users || !name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // var userss = JSON.parse(users);
  // console.log(users)
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required for a group chat");
  }

  // push req.user in users array
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json("Chat not found");
    } else {
      return res.status(200).json(updatedChat);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({
        message: "Chat not found",
      });
    } else {
      res.json(added);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

export const removeUser = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const removetoChat = await Chat.findByIdAndUpdate(chatId, {
      $pull: { users: userId },
    })
      .populate("users", "-password -followeres -following -notification")
      .populate("groupAdmin", "-password");

    if (!removetoChat) {
      return res.status(404).json({ messagte: "Chat doesnot exists" });
    } else {
      return res.status(200).json(removetoChat);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
