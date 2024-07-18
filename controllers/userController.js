import User from "../Models/User.js";
import mongoose from 'mongoose'

export const followUser = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;
    // using $addtoset mongodb update operator
    // add friendId to the users following list
    let user = await User.findById(userId);
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { following: friendId },
      },
      { new: true }
    );
    //    add userId to the friends followers list

    await User.findByIdAndUpdate(
      friendId,
      {
        $addToSet: { followers: userId },
      },
      { new: true }
    );

    // prepare notification for the followed user
    const notification = {
      type: "Follow",
      message: `${user.firstName} follows you`,
    }
    const followedUser = await User.findByIdAndUpdate(friendId,{
      $addToSet:{notifications:notification}
    });
 
    return res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ Error: "Internal Server Error", error });
  }
};

export const unFollowUser = async (req, res) => {
  try {
    // get the user and friend id
    const userId = req.user.id;
    const { friendId } = req.params;

    // remove friendId from the users following array
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { following: friendId },
      },
      { new: true }
    );

    // remove userId from the friend followers array
    await User.findByIdAndUpdate(
      friendId,
      {
        $pull: { followers: userId },
      },
      { new: true }
    );

    // prepare notification for the unfollowed user
    const user = await User.findById(userId);

    const notification = {
      type: "Unfollow",
      message: `${user.firstName} unfollows you`,
    }

    const unfollowedUser = await User.findByIdAndUpdate(friendId,{
      $addToSet:{notifications:notification}
    });
 

    return res.status(200).json({ Success: "unfollowed sucessfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ Error: "Internal Server Error", error });
  }
};

// route to get all following

export const getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ Error: "user not found" });
    }

    const followeeIds = user?.following;
    if (!followeeIds.length) {
      return res.status(404).json({ Error: "no following" });
    }
    // get details of all users including in following array
    const followeeDetails = await User.find({ _id: { $in: followeeIds } });
    if (!followeeDetails.length) {
      return res
        .status(404)
        .json({ Error: "No details found for following users" });
    }
    return res.status(200).json({ followeeDetails });
  } catch (error) {
    console.log(error);
  }
};

// controller to get all followers

export const getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ Error: "No such user Found" });
    }

    const followersId = user?.followers;

    if (!followersId.length) {
      return res.status(404).json({ Error: "no followers" });
    }

    const followersDetails = await User.find({ _id: { $in: followersId } });

    if (!followersDetails) {
      return res.status(404).json({ Error: "No details found to this users" });
    }

    return res.status(200).json({ followers: followersDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

// access a follower or following using with its id
export const getUserwithId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ Error: "no such user found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

// access users with their name and their email id

export const getSearchUser = async (req, res) => {
  const userId = req.user._id;
  console.log(userId)
  try {
    const keyword = req.query.search ? {
        $or:[
          {firstName:{$regex:req.query.search,$options:"i"}},
          {email:{$regex:req.query.search,$options:"i"}},
        ],
    }:
    {};

    // if(userId?.match(/^[-9a-fA-F]{24}$/)){
      const users = await User.find(keyword)
      // check if users were found
  
      if (!users.length) {
        return res.status(404).json({ Error: "No user found" });
      }
      res.status(200).json(users);
      console.log(users);
    // }else{
    //   console.log("objectId is not in valid format")
    // }
 
  } catch (error) {
    console.error(error)
  }
};
