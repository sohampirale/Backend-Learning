const express = require("express");
const jwt = require("jsonwebtoken");
const {z} = require("zod");
const mongoose = require("mongoose");
const dotenv =require("dotenv");
// const useragent = require('express-useragent');
const app = express();
const {User,Student,Teacher} = require("./models/user.models.js");
dotenv.config();

async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGODB_URI+"/CourseSellingApp");
    console.log('DB connected successfuly!');
    app.listen(process.env.PORT,()=>{
      console.log('server runnign on port '+process.env.PORT);
    })
  } catch(err){
    console.log('Failed to connect with DB');
    // console.log(err);
  }
}

const {userRouter} = require("./routes/user.routes.js");
const {adminRouter} = require("./routes/admin.routes.js");

app.use(express.json());

app.use("/user",userRouter);
app.use("/admin",adminRouter);

app.post("/api/auth/login",async(req,res)=>{
  const requiredBodySchema= z.object({
    username:z.string().min(3).max(100).optional(),
    email:z.string().min(5).max(100).optional(),
    password:z.string().min(3).max(100)
      .refine(val=>/[a-z]/.test(val))
      .refine(val=>/[A-Z]/.test(val))
      .refine(val=>/[0-9]/.test(val))
      .refine(val=>/[\W_]/.test(val))
  })
  
  const parsedReqBody = requiredBodySchema.safeParse();

  const {username,email,password}=parsedReqBody;

  let user=null;

  if(!username&&!email){
    return res.status(403).json({
      msg:"Email or phone no is necessary"
    })
  } else if(!parsedReqBody.success){
    return res.status(403).josn({
      msg:"Insufficient/Incorrect data provided"
    })   
  } else if(email){
    user= await User.find({
      email,
      password
    })
  } else if(username){
    user= await User.find({
      username,
      email
    })
  }

  if(!user){
    return res.status(404).josn({
      msg:"Incorrect Credentials"
    })
  }
  res.status(200).json({
    msg:"Login successfull!",
    token:jwt.sign({
      username:user.username
    },process.env.JWT_PW)
  })
})

app.post("/api/auth/signup",async (req,res)=>{
  const requiredBodySchema = z.object({
    username:z.string().min(3).max(100),
    email:z.string().email().min(5).max(100),
    password:z.string().min(8).max(100)
      .refine(val=>/[a-z]/.test(val))
      .refine(val=>/[A-Z]/.test(val))
      .refine(val=>/[0-9]/.test(val))
      .refine(val => /[\W_]/.test(val))
  })

  const parsedReqBody=requiredBodySchema.safeParse(req.body);

  if(!parsedReqBody.success){
    return res.status(403).json({
      msg:"Insufficient Data"
    })
  } 
  const {username,password,email} = parsedReqBody.data;

  try{
    await Student.create({
      username,
      email,
      password
    })
    res.status(200).json({
      msg:"Student Signup sucessfull"
    })
  } catch(err){
    console.log(err);
    res.status(403).json({
      msg:"Signup failed",
      err
    })
  }
})

connectDB();

// app.listen(process.env.PORT,()=>{
//   console.log('Server listening  on port : '+process.env.PORT);
// });