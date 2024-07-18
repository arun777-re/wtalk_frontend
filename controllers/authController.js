import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = "arunrekha";



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user with specify email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ Error: "Invalid credentials" });
    }
    //    compare password with hash
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(404).json({ Error: "Invalid credentials" });
    }
    // generate token
    // passing userId as payload wrapped in object
    const userId = { id: user._id };
    const token = jwt.sign(userId, JWT_SECRET);
    return res.status(200).json({token});
    // res.redirect('http://localhost:8000/user/getuser')
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ Error: "Internal Server Error", error });
  }
};

// controller to get all users
export const getallUser = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({user});
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (req, res) => {
  try {
const {id} = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ Error: "no such user exists " });
    }

    return res.status(200).json({user});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ Error: "Internal Server Error", error });
  }
};


// controller to delete all users
export const deleteallUsers = async (req,res)=>{
try {
  const deleteUser = await User.deleteMany();

  return res.status(200).json("all users deleted successfully")
} catch (error) {
  
}


}