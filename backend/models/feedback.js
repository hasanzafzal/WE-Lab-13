import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comments:{
        type:String
    }
});

export default mongoose.model("Feedback", feedbackSchema);