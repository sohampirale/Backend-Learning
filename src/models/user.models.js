import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { decrypt } from "dotenv";
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true
  },
  password:{
    type:String,
    required:true,
    min:8
  },
  history:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
  }],
  likedVideos:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
  }],
  avatar:{
    type:String,
    default:"no-profile.png"
  },
  coverImage:[{
    type:String,
    default:"no-coverimage.png"
  }],
  token:{
    type:String,
    required:true,
  }
},{timestamps:true});

userSchema.pre("save",(next)=>{
  if(this.isModified("password")){
    console.log('hashing password before saving the user');
    this.password=bcrypt.hash(this.password,10);
  }
  next();
})

userSchema.methods.isPasswordCorrect(async (password)=>{
  return await decrypt.compare(password,this.password);
})

userSchema.methods.giveAccessToken(()=>{
  return jwt.sign({
    username:this.username,
    email:this.email
  },process.env.JWT_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  })
})

export const User = mongoose.model("User",userSchema);