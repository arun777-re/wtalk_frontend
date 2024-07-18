import User from "../Models/User.js";
import Post from "../models/Post.js";

// CRUD operations
export const readPost = async(req,res)=>{
try {
    const {postId} = req.params;
    // fetch the post by id
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({Error:"Post Not Found"})
    }

    return res.status(200).json(post)
} catch (error) {
    console.log(error);
    return res.status(500).json({Error:"Internal Server Error"});
}
}


export const updatePost = async(req,res)=>{
try {
    
} catch (error) {
    console.log(error);
    return res.status(500).json({Error:"Internal Server Error"});
}
}


export const deletePost = async(req,res)=>{
try {

    const {postId} = req.params;

    const deletePost = await Post.findByIdAndDelete(postId);

    if(!deletePost){
        return res.status(404).json({Error:"No such Post exists with provided Id"})
    }

    return res.status(200).json({Success:"post delete sucessfully"})
    
} catch (error) {
    console.log(error);
    return res.status(500).json({Error:"Internal Server Error"});
}
}

// like a Post


export const likePost = async (req,res)=>{
    try {
         
        const visitorId = req.user.id;
        const {postId} = req.params;
        const post = await Post.findByIdAndUpdate(postId,{
            $addToSet:{likes:visitorId}
        },{new:true});

        if(!post){
            return res.status(404).json({Error:"No such post Exixts with id"})
        }
        
        return res.status(200).json({success:"Post updated sucessfully",post})
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({Error:"Internal Server Error"})
    }
}
export const dislikePost = async (req,res)=>{
    try {

        const {postId} = req.params;
        const visitorId = req.user.id;

        const dislike = await Post.findByIdAndUpdate(postId,{
           $pull:{likes:visitorId}
        },{new:true});

        if(!dislike){
            return res.status(404).json({Error:"No such Post Exists with this Id"})
        }

        return res.status(200).json({Success:"Post dislike sucessfull",dislike})

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({Error:"Internal Server Error"})
    }
}

 export const createComment = async(req,res)=>{
    try {
        const text1 = req.body.text1;
        const commenterId = req.user.id;
        const {postId} = req.params;
        console.log(postId)
         // we can add validation input data using express--validator

        const newComment = {
            commenterId,
            text1,
        }
        
        const post = await Post.findByIdAndUpdate(postId,{
            $addToSet:{comments:newComment}
        },{new:true});
        
        if(!post){
            return res.status(404).json({Error:"No Post exist with this Id"})
        }
// prepare notification for comment
       const userIdInPost = post?._userId;
       const commenter = await User.findById(commenterId);
       const notification = {
        type:"comment",
        message:`${commenter?.firstName} comment on your post` 
       }
       const user = await User.findByIdAndUpdate(userIdInPost,{
        $addToSet:{notifications:notification}
       });

        return res.status(200).json({Success:"Comment added Successfully",post})


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({Error:"Internal Server Error"})
    }
 }


//  delete a comment

export const deleteComment = async(req,res)=>{

    try {
        const {postId,commentId} = req.params;
         console.log(postId);
         console.log(commentId);
        const post = await Post.findByIdAndUpdate(postId,{
            $pull:{comments:{_id:commentId}}
        },{new:true});

        if(!post){
            return res.status(404).json({Error:"No such post exists with this postId"})
        }

        return res.status(200).json({Success:"Post deleted successfully",post})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({Error:"Internal Server Error"})
    }
}


// controller to get all Posts

export const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find();
        
        if(!posts || posts.length === 0){
            return res.status(404).json({Error:"No Post to display"})
        }

        return res.status(200).json(posts)
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({Error:"Internal Server Error"})
    }
}

// controller to get posts for  login user
export const getPostForaUser = async(req,res)=>{
    try {
        const userId = req.user.id;

        const posts = await Post.find({userId});

        if(!posts || posts.length === 0){
            return res.status(404).json({Error:"User have no posts to display"})
        }
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({Error:"Internal Server Error"})
    }
} 


// controller to get posts related to user and their friends

export const getPostForUserAndFriends = async(req,res)=>{
    try {
       const userId = req.user.id; 
       console.log(userId);

    //    find the users following
        const userFollowing = await User.findById(userId);
    //    extracting array included in user
        const following = userFollowing.following;
console.log(following)
        
        // find posts related to user or his following
        const posts = await Post.find({
            $or:[
                // Post created by the user
                {userId:userId},
                // post created by users following
                {userId:{$in:following}}
            ]
        });
        console.log(posts)

        return res.status(200).json(posts);


    } catch (error) {
        console.error(error.message);
        return res.status(500).json({Error:"Internal Server Error"})
    }
}