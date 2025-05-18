const express = require("express");
const { User,Base,Admin } = require("../models/user.models");
const { JsonWebTokenError } = require("jsonwebtoken");
const userRouter = express.Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {Course} = require("../models/course.models");

function authMiddleware(req,res,next){
  const token = req.headers.token;
  if(!token){
    return res.status(404).json({
      msg:"Token not found"
    })
  }

  try{
    jwt.verify(token,process.env.JWT_PW);
    next();
  } catch(err){
    return res.status(404).json({
      msg:"Invalid token"
    })
  }
}

userRouter.post("/login",async(req,res)=>{
  console.log('inside /login');
  const requiredBodySchema = z.object({
    username:z.string().min(3).max(100).optional(),
    email:z.string().email().min(5).max(100).optional(),
    password:z.string().min(8).max(100)
      .refine(val=>/[a-z]/.test(val))
      .refine(val=>/[A-Z]/.test(val))
      .refine(val=>/[0-9]/.test(val))
      .refine(val=>/[\W_]/.test(val))
  })

  const parsedBody = requiredBodySchema.safeParse(req.body);

  if(!parsedBody.success){
    return res.status(403).json({
      msg:"Insiffienct/Incorrect data provided",
      error:parsedBody.error
    })
  }

  const {username,email,password} = parsedBody.data;
  let user=null;

  if(!username&&!email){
    return res.status(404).josn({
      msg:"Email or username is necessary to login"
    })
  }
  if(username){
    user = await User.findOne({
      username
    })
  } else if(email){
    user= await User.findOne([
      email
    ])
  }
  
  if(!user){
    return res.status(403).json({
      msg:"User does not exist"
    })
  }

  if(await bcrypt.compare(password,user.password)){
    res.status(200).json({
      msg:"Login successfull",
      token:jwt.sign({
        username:user.username,
        _id:user._id
      },process.env.JWT_PW)
    })
  } else {
    res.status(404).json({
      msg:"Incorrect password"
    })
  }
})

userRouter.post("/signup",async (req,res)=>{
  console.log('inside /signup');
  
  const requiredBody=z.object({
    username:z.string().min(3).max(100),
    email:z.string().email().min(5).max(100),
    password:z.string().min(8).max(100)
      .refine(val=>/[A-Z]/.test(val))
      .refine(val=>/[a-z]/.test(val))
      .refine(val=>/[0-9]/.test(val))
      .refine(val=>/[\W_]/.test(val))  
  })

  const parsedBody= requiredBody.safeParse(req.body);
  if(!parsedBody.success){
    return res.status(403).json({
      msg:"Insufficient/Incorrect Information provided",
      error:parsedBody.error
    })
  }
  const {username,email,password} = parsedBody.data;

  let user=null;

  // try{

  user = await User.create({
    username,
    email,
    password:await bcrypt.hash(password,5),
    enrolledCourses:[]
  })

  return res.status(200).json({ 
    msg:"Signup successfull",
    token:jwt.sign({
      _id:user._id,
      username
    },process.env.JWT_PW)
  })

  // }catch(err){
  //   return res.status(403).json({
  //     msg:"Failed to signup",
  //     error:err
  //   })
  // }
})

userRouter.get("/courses",authMiddleware,async(req,res)=>{
  console.log('inside /courses');
  const courses=await Course.find();
  res.status(200).json({
    msg:"All courses sent successfully",
    courses
  })
})

userRouter.post("/enrollInCourse",authMiddleware,async(req,res)=>{
  const requiredBody=z.object({
    token:z.string().min(5).max(100),
    courseId:z.string().min(5).max(100) 
  })

  const parsedBody= requiredBody.safeParse(req.body);
  if(!parsedBody.success){
    return res.status(404).json({
      msg:"Insufficient/Incorrect fields provided"
    })
  }

  const {token,courseId} = parsedBody.data;

  const {username} = jwt.decode(username);
  const user = await User.findOne({
    username
  })

  if(!user){
    return res.status(404).json({
      msg:"User does not exist"
    })
  }

  let alreadyBought = false;
  for(let i=0;i<user.enrolledCourses.size();i++){
    if(enrolledCourses[i]==courseId){
      alreadyBought=true;
      break;
    }
  }

  if(alreadyBought){
    return res.status(404).json({
      msg:"This course is already brought by you"
    })
  } else {
    user.enrolledCourses.push(courseId);
    await user.save();

    return res.status(200).json({
      msg:"Course brought successfully"
    })
  }

})

module.exports={
  userRouter
}

