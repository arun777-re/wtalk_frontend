import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    description:{
        type:String,
        required:true,
    },
    imageUrl:[{
    type:String,
    required:true
    }],
    videoUrl:[{
        type:String,
         required:false
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[{
        commenterId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        text1:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now,
        }
          
    }]
    
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);
export default Post;