import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';


export const signin = async(req,res) =>{
    const {email,password} = req.body;

    try {
        // Find existing user
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message:'User Doesnt Exist'});
        // Check for password
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({message:'Invalid Credentials'});
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'1h'});
        res.status(200).json({result:existingUser,token})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Something went wrong.'});
    }
}


export const signup = async(req,res) =>{
    const {email,password,firstName,lastName,confirmPassword} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:'User Already Exists!',errorCode:2});
        if(password !== confirmPassword) return res.status(400).json({message:'Passwords dont match'});
        const hashedPassword = await bcrypt.hash(password,12);

        const result = await User.create({email,password:hashedPassword,name:`${firstName} ${lastName}`});
        const token = jwt.sign({email:result.email,id:result._id},process.env.SECRET_KEY,{expiresIn:'1h'});
        res.status(200).json({result,token});

    } catch (error) {
        res.status(500).json({message:'Something Went Wrong!'});
    }
}