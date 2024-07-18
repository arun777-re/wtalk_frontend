import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const JWT_SECRET = 'arunrekha';


export const verifyToken = async (req,res,next)=>{
    try {
        let token =  req.header('authorization');
        if(!token){
            return res.status(403).json({Error:"Access Denied"});
        }
        if(token.startsWith('Bearer')){
            token = token.slice(7,token.length).trimLeft();
        }


        const data =  jwt.verify(token,JWT_SECRET);
        // add the decoded user information to the req obj
        const user = await User.findById(data.id);
        req.user = user;
        next()

    } catch (error) {
        console.log(error)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }

    }
}