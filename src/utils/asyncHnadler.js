function asyncHandler(fn){
  return async(req,res,next)=>{
    try{
      await fn(req,res,next);
    } catch(err){
      console.log("ERROR : "+err.message);
      next(err);
    }
  }
}

function asyncHandler(fn){
  return async(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).then(()=>{
      console.log("fn funciton ran successfully");
      next()
    }).catch((err)=>{
      console.log("ERROR : "+err.message);
      next(err);
    })
  }
}
export {asyncHandler};