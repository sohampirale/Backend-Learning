const mongoose = require("mongoose");
const { string } = require("zod");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const baseSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
},{
  timestamps:true,
  discriminatorKey:'kind'
});

const courseInfoSchema= Schema({
  coursename:{
   type:String,
   required:true 
  },
  _id:{
    type:ObjectId,
    ref:"Course"
  }
},{
  timestamps:false
})

const userSchema = new Schema({
  enrolledCourses:[courseInfoSchema]
},{timestamps:true});

const adminSchema = new Schema({
  uploadedCourses:[courseInfoSchema]
},{timestamps:true})

const Base = mongoose.model("Base",baseSchema);

const User = Base.discriminator("User",userSchema);

const Admin = Base.discriminator("Admin",adminSchema);

module.exports={Admin,Base,User};