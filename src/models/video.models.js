import mongoose from "mongoose";

const videoSchema=new mongoose.Schema({
  id:{
    type:Number,
    required:true,
    unique:true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  publishedDate:{
    type:Date,
    default:Date.now,
    immutable:true
  },
  accessibility:{
    type:String,
    enum:["public","protected","private"],
    default:"public"
  },
  duration:{
    type:Number,
    required:true
  },
  likedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  category:{
    type:String
    // enum:allCategories //import allCategories from constants.js
  },
  url:{
    type:String, //claudinary
    required:true
  },
  thumbnail:{
    type:String,//claudinary
    required:true
  },keywords:[{
    type:String
  }],
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  views:{
    type:Number,
    default:0
  }
  
},{timestamps:true})

export const Video = mongoose.model("Video",videoSchema)