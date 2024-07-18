import mongoose from "mongoose";


export const func = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI
        
           
        );
        console.log('Server is connected to database',process.env.MONGO_URI)
    } catch (error) {
        console.error(error.message);
    }

};