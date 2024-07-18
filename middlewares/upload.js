import multer from "multer";
import path from 'path'
// create storage for file uploads
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "-" + file.originalname)
    }
});

// creating multer instance
export const upload = multer({storage,limits:{
    fileSize:1024*1024*20
}});