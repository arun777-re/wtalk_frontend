import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import { func } from "./db.js";
import { Server } from "socket.io";
import http from 'http';
func();
import { verifyToken } from "./middlewares/verifyToken.js";
import { upload } from "./middlewares/upload.js";
import User from "./Models/User.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import Post from "./models/Post.js";

// making application as express application
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
  }
});

app.set('socketio',io);
// socket.io connection handling
io.on('connection',(socket)=>{
  console.log("A user connected")

socket.on('join',(roomName)=>{
  socket.join(roomName);
  console.log(`chat room joined: ${roomName}`)
});

// handle incoming message
socket.on('sendMessage',(roomName,data)=>{
  var chat = data?.text;
  console.log(data);
  console.log("message recieved :",roomName);

  // broadcast message to all the users except sender
 io.emit('message',data);

});
// handle disconnect
socket.on('disconnect',()=>{
  console.log("User disconnected")
});
});

// milddlewares
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));

// use static files
app.use(express.static("./uploads"));



// route midleware
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/message", messageRoutes);
app.use("/chat", chatRoutes);

// route for uploading files for register and createpost
app.post('/post/create',verifyToken,upload.fields([{name:"imageUrl",maxCount:1},{name:"videoUrl",maxCount:1}]),async(req,res)=>{
  try {
    const {description} = req.body;
    const {imageUrl,videoUrl} = req.files;

  
     
   let url1 = '';
   let url2 = '';

    if(req.files.imageUrl){
       url1 = req.protocol + "://" + req.get("host") + "/" + req.files.imageUrl[0].filename;
    }
    if(req.files.videoUrl){
       url2 = req.protocol + "://" + req.get("host") + "/" + req.files.videoUrl[0].filename;
    }

   const post = new Post({
    userId:req.user.id,
    description,
    imageUrl:url1,
    videoUrl:url2
   });

   const newPost = await post.save();

   return res.status(201).json(newPost);

  } catch (error) {
    console.error(error);
    return res.status(500).json({Error:"Error during creating a new post",error})
  }
})

app.post("/auth/register", upload.single("file"), async (req, res) => {
  try {
    const { firstName, lastName, bio, email, password } = req.body;
    let url = "";

    if (req.file) {
      console.log("file recieved");
      url = req.protocol + "://" + req.get("host") + "/" + req.file.filename;
    }

    // hash password after getting it from body using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      bio,
      email,
      password: hash,
      userPicture: url,
    });    

    const newUser = await user.save();

    return res.status(201).json({ newUser });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ Error: "Internal Server Error", error });
  }
});

//  route for create a post

// making server
const port = process.env.PORT || 8000;
const uri = process.env.MONGO_URI;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
