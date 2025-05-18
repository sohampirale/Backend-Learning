const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const courseSchema=new Schema({
  courseName:{
    type:String,
    required:true
  },
  tags:[String],
  startDate:{
    type:Date,
    required:true
  },
  endDate:{
    type:Date,
    required:true
  }
},{
  timestamps:true
})

const Course = mongoose.model("/Course",courseSchema)