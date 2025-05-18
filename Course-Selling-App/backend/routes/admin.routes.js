const express = require("express");
const { Admin } = require("../models/user.models");
const adminRouter = express.Router();
const {Course} = require("../models/course.models")

function adminMiddleware(req,res,next){
  const reqBody=z.object({
    token:z.string().min(3).max(200)
  })
  const parsedBody = reqBody.safeParse(req.body);
  if(!parsedBody.success){
    return res.status(403).json({
        msg:"token is required"
    })
  }

  try{
    jwt.verify(parsedBody.data.token,process.env.JWT_PW);
    next();
  } catch(err){
    return res.status(404).json({
      msg:"Token Invalid"
    })
  }
}

adminRouter.get("/login",async(req,res)=>{
  const requiredBody= z.object({
    username:z.string().min(3).max(100).optional(),
    email:z.string().email().min(5).max(100).optional(),
    password:z.string().min(8).max(100)
      .refine(val=>/[A-Z]/.test(val))
      .refine(val=>/[a-z]/.test(val))
      .refine(val=>/[0-9]/.test(val))
      .refine(val=>/[\W_]/.test(val))
  })

  const parsedBody=requiredBody.safeParse(req.body);
  if(!parsedBody.success){
    return res.status(403).json({
      msg:"Insufficient/Incorrect data provided"
    })
  }

  const {username,email,password} = parsedBody.data;
  let admin=null;
  if(username){
    admin=await Admin.findOne({
      username
    })
  } else if(email){
    admin= await Admin.findOne({
      email
    })
  }
  if(!admin){
    return res.status(404).json({
      msg:"Admin does not exists"
    })
  }

  if(bcrypt.compare(password,admin.password)){
    return res.status(200).json({
      msg:"Login successfull",
      token:jwt.sign({
        _id:admin._id,
        username:admin.username
      },process.env.JWT_PW)
    })
  } else {
    return res.status(403).json({
      msg:"Incorrect password"
    })
  }
})

adminRouter.post("/signup",async(req,res)=>{
  const reqBody=z.object({
    username:z.string().min(3).max(100),
    email:z.string().email().min(5).max(100),
    password:z.string().min(8).max(100)
      .refine(val=>/[A-Z]/.test(val))
      .refine(val=>/[a-z]/.test(val))
      .refine(val=>/[0-9]/.test(val))
      .refine(val=>/[\W_]/.test(val))
  })

  const parsedBody = reqBody.safeParse();

  if(!parsedBody.success){
    return res.status(403).json({
      msg:"Insufficient/Incorrect data"
    })
  }

  const {username,email,password} = parsedBody.data;
  
  try{
    const admin = await Admin.create({
      username,
      email,
      password,
      uploadedCourses:[]
    })
    return res.status(200).json({
      msg:"New admin created successfully",
      token:jwt.sign({
        _id:admin._id,
        username:admin-username
      },process.env.JWT_PW)
    })
  } catch(err){
    return res.status(403).json({
      msg:"Failed to signup"
    })
  }
})

adminRouter.post("/uploadCourse",adminMiddleware,async(req,res)=>{
  const reqBody=z.object({
    courseName:z.string().min(5).max(200),
    startDate:z.date(),
    endDate:z.date(),
    token:z.string()
  })

  const parsedBody= reqBody.safeParse(req.body);
  if(!parsedBody.success){
    return res.status(403).json({
      msg:"Insufficient/Incorrect data provided"
    })
  } 

  const {coursename,startDate,endDate,token}= parsedBody.data;
  const {username} = jwt.decode(token);

  const admin = await Admin.findOne({
    username
  })

  let alreadyUploaded=false;
  for(let i=0;i<admin.uploadedCourses.size();i++){
    if(admin.uploadedCourses[i].coursename){
      alreadyUploaded=true;
      break;
    }
  }
  
  if(alreadyUploaded){
    return res.status(201).json({
      msg:"You already have uploaded this course"
    })
  }
  try{
    const course = await Course.create({
      coursename,
      startDate,
      endDate,
      tags:[]
    })
    admin.uploadedCourses.push({
      coursename,
      _id:course._id
    })
    await admin.save();
    return res.status(200).json({
      msg:"New course uploaded successfully"
    })
  } catch(err){
    return res.status(400).json({
      msg:"Failed to upload new course"
    })
  }
})

module.exports = {
  adminRouter
}