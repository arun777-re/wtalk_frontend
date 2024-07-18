import express from 'express';
import { login } from '../controllers/authController.js';
import { upload } from '../middlewares/upload.js';
import User from '../Models/User.js';
import bcrypt from 'bcrypt';
const router = express.Router();


router.post('/login',login);



export default router;       