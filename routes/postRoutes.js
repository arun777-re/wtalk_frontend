import express from "express";
import {
  createComment,
  deleteComment,
  dislikePost,
  getAllPosts,
  getPostForUserAndFriends,
  getPostForaUser,
  likePost,
} from "../controllers/postController.js";
import {verifyToken} from '../middlewares/verifyToken.js'

const router = express.Router();

// route for like a post
router.patch("/like/:postId",verifyToken, likePost);

// route for dislikePost
router.patch("/dislike/:postId",verifyToken, dislikePost);

// route for comment on a post

router.post("/comment/:postId",verifyToken, createComment);

// route for deleting a post

router.delete("/comment/:postId/:commentId",verifyToken, deleteComment);

// route to get posts related to user and his following 

router.get('/posts',verifyToken,getPostForUserAndFriends);

// route to get all posts of a user

router.get('/userposts/:userId',verifyToken,getPostForaUser);

// router for get all posts
router.get('/allposts',verifyToken,getAllPosts)

export default router;
