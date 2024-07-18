import express from 'express'
import { deleteallUsers, getUser,getallUser } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { followUser, getFollowers, getFollowing, getSearchUser, getUserwithId, unFollowUser } from '../controllers/userController.js';
const router = express.Router();


// router to get all users
router.get('/users',getallUser);

// router to get a user
router.get('/getuser',verifyToken,getUser);

router.delete('/delete',deleteallUsers);

// router to follow a user

router.patch('/:friendId/follow',verifyToken,followUser);

// router to unfollow 
router.patch('/:friendId/unfollow',verifyToken,unFollowUser)

// router to get all following
router.get('/followee',verifyToken,getFollowing);

// router to get all followers 
router.get('/followers',verifyToken,getFollowers);

// router to get a user with id in req.params
// router.get('/:id',getUserwithId);


// route to get seached users

router.get('/searchuser',verifyToken,getSearchUser)


export default router;
