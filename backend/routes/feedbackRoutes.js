import express from "express";
import Feedback from "../models/feedback.js";

const router = express.Router();

router.post("/feedback", async(req,res)=>{
    try{
        const data = await Feedback.create(req.body);
        res.status(201).json({
            message:"Feedback Submitted",
            data
        });
    }
    catch(error){
        res.status(400).json(error);
    }
});

router.get("/feedbacks", async(req,res)=>{
    const data = await Feedback.find();
    res.json(data);
});

router.get("/feedbacks/:subject", async(req,res)=>{
    const data = await Feedback.find({
        subject:req.params.subject
    });
    res.json(data);
});

export default router;