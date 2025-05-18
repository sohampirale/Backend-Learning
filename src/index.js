import mongoose, { connect } from "mongoose";
import {DB_NAME} from "./constants.js"
import dotenv from 'dotenv';
import express from "express"
const app=express();
dotenv.config();

async function connectDB() {
  try {
    console.log('MongoDB_URI = '+process.env.MONGODB_URI);
    
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/demo`);
    console.log('connected to DB successfully');
    console.log('Connection HOST : '+connectionInstance.connection.host);
    
  } catch (error) {
    console.log('Error connecting to DB');
    throw error;
  }
}

connectDB();







/*
(async ()=>{
  try {
    console.log("hi");
    
    await mongoose.connect(`${process.env.MONGODB_URI}/demo`);
    console.log('connected to DB successfully!');
    app.on("error",(error)=>{
      console.log("Error connecting express with DB");
      console.log("Error : "+error);
      throw error;
    })
    app.listen(process.env.PORT,()=>{
      console.log('app listening on port '+process.env.PORT);
    })
  } catch (error) {
    console.log('Error connecting to DB');
    throw error;
  }
})()

console.log("hello");
*/