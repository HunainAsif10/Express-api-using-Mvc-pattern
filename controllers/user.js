import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { body, validationResult } from "express-validator";

// <-----------------createUser------------------>
export const createUser = async (req, res, next) => {
  try {
    // apply express-validator
    await body("name", "Name must be atleast 3 characters").isLength({ min: 3 }).run(req);
    await body("email", "Enter a Valid Email").isEmail().run(req);
    await body("password", "Password must be atleast 5 characters long").isLength({ min: 5 }).run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // createUser
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(401).json("User with this email already exists");
    }
    // apply bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    user = await newUser.save();
    // jwt data contain id & isAdmin
    const data = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };
    // apply jwt token 
    const token = jwt.sign(data, process.env.JWT_SEC);
    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// <-------------------loginUser-------------->

export const loginUser=async(req,res,next)=>{
    try {
        // apply express-validator
        await body('email',"Enter a Valid Email").isEmail().run(req);
        await body ("password","Enter a Valid Password").exists().run(req);
        
        let errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        // loginUser
        const {email,password}=req.body;
        
        let user=await User.findOne({email})
        if(!user){
            return res.status(401).json("Please authenticate using correct credentials");
        }
        // apply bcrypt
        let passwordCompare=await bcrypt.compare(password,user.password);

        if(!passwordCompare){
                 return res.status(401).json("Please Enter using correct credentials");
        }
        const data={
            user:{
                id:user.id,
                isAdmin:user.isAdmin
            }
        }
        // apply jwt
        const token = jwt.sign(data,process.env.JWT_SEC);

        res.status(200).json({token});
    } catch (error) {
        return res.status(500).json("Internal Server Error")
        
    }
}


// <------------updateUser------------------>

export const updateUser=async(req,res,next)=>{
    try {
        if(req.body.password){
            let salt =await bcrypt.genSalt(10);
            let hash=await bcrypt.hash(req.body.password,salt)
            req.body.password=hash;
        }
        let updateUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updateUser);

    } catch (error) {
        return res.status(500).json("Internal Server Error")
    }
}


// <------------------- deleteUser----------------->

export const deleteUser=async(req,res,next)=>{
    try {
        let deleteUser=await User.findByIdAndDelete(req.params.id)
        res.status(200).json(deleteUser)
        
    } catch (error) {
        return res.status(500).json("Internal Server Error")
        
    }
}















