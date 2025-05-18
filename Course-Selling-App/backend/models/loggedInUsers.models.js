const mongoose = require("mongoose");
const {z} = require("zod");
const Schema = mongoose.Schema;

const loggedInUsersSchema = new Schema({
  username:{
    type:string,
    required:true
  },
  loginTime:{
    type:Date,
    default:Date.now
  },
  logoutTime:{
    type:Date
  },
  currentlyLoggedIn:{
    type:Boolean,
    default:true
  }
},{
  timestamps:true
})

const LoggedInUsers= mongoose.model("LoggedInUsers",loggedInUsersSchema);

module.exports={LoggedInUsers};