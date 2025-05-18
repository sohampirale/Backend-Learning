const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const app = express();
const JWT_PW="SOHAMPIRALE";

const todos={}

function authenticationMiddleware(req,res,next){
  try{
    jwt.verify(req.body.token,JWT_PW);
    next();
  } catch(err){
    return res.status(404).json({
      msg:"Unauthorized"
    })
  }
}


app.use(express.json());

app.post('/login',(req,res)=>{
  console.log('inside /login');
  return res.status(200).json({
    msg:"Login Successful"
  })
})

app.post('/signup',(req,res)=>{
  console.log('inside /signup');
  try{
    const token =  jwt.sign({
      username:req.body.username
    },JWT_PW);
    console.log('token generated : '+token );
    // req.cookies.token=token;
    return res.status(200).json({
      msg:"Signup successful(token stored successfully)",
      token
    });
  } catch(err){
    return res.status(404).json({msg:"Failed to sign the token"});
  }
})

app.get("/todos",authenticationMiddleware,(req,res)=>{
  console.log('inside /todos');
  const data=jwt.decode(res.body.token)
  const username=data.username;
  req.status(200).json({
    msg:'All todos of '+username,
    todos:todos[username]
  })
})

app.post('/todo',authenticationMiddleware,(req,res)=>{
  console.log('inside /todo');
  const data=jwt.decode(req.body.token);
  const username=data.username;
  const todo=req.body.todo;
  if(todos[username]){
    todos[username].push(todo);
  } else {
    todos[username]=[todo];
  }
  res.status(200).json({
    msg:'Todo added successfully'
  })
})


app.get('/giveAll',(req,res)=>{
  console.log('inside /getAll');
  res.status(200).json({
    allTodos:todos
  })
})

app.listen(3000,()=>{
  console.log('server started on port 3000');
})