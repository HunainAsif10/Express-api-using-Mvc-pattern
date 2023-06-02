import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const fetchUser=(req,res,next)=>{
    const token =req.header("auth-token")
    if(!token){
        return res.status(401).json("Please authenticate using a token")
    }
    
    const data=jwt.verify(token,process.env.JWT_SEC)
    req.user=data.user;
    next()
}

export const fetchAndAuthenticate=(req,res,next)=>{
    fetchUser(req,res,()=>{
        if((req.params.id===req.user.id) || req.user.isAdmin){
            // console.log(req.params.id)
            // console.log(req.user.isAdmin)
            // console.log(req.user.id)
              next()
        }
        else{
            return res.status(401).json("Please Authenticate using correct credentials")
        }
    })
}

