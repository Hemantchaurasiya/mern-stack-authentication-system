const Joi = require('joi');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User-model");
const UserVerifyToken = require("../models/User-verify-token-model");
const JwtRefreshToken = require("../models/Jwt-refresh-token-model");
const {sendRegisterVerificationEmail,sendResetPasswordEmail} = require("../services/send-email-service");

const Register = async(req,res)=>{
    // validation
    const registerSchema = Joi.object({
        username:Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password:Joi.ref('password')
    });

    const{error} = registerSchema.validate(req.body);
    if(error){
        return res.status(500).json(error);
    }

    // check if user is in the database already
    try {
        const exist = await User.exists({email:req.body.email});
        if (exist) {
            return res.status(401).json('This email is already taken.');
        }
    } catch (error) {
        return res.status(500).json(error);
    }

    // if not in database then create the user
    const {username,email,password} = req.body;

    // hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    // prepare the model
    const newUser = new User({
        username:username,
        email:email,
        password:hashedPassword,
    });
    
    try {
        // save user in database
        await newUser.save();
        //genrate token
        const token = crypto.randomBytes(64).toString('hex');
        // save token in database
        const email_token = new UserVerifyToken({token:token,email:email});
        await email_token.save();
        // send email
        sendRegisterVerificationEmail(email,token);
        return res.status(200).json('user register successfully.Please Check your email to verify your account');
    } catch (error) {
        return res.status(500).json(error);
    }
}

// login user
const Login = async(req,res)=>{
    // validation
    const loginSchema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });

    const {error} = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error);
    }
    // check user in database or not
    try {
        const user = await User.findOne({email:req.body.email});
        // if user not in database
        if (!user) {
            return res.status(401).json("invalid email");
        }
        // if user then compare the password
        const match = await bcrypt.compare(req.body.password,user.password);
        if (!match) {
            return res.status(401).json("Incorrect Password");
        }

        if(user.isVerified === false){
            return res.status(401).json("user is not verified");
        }
        // token
        const access_token = jwt.sign({_id:user._id},process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn:'60s'});
        const refresh_token = jwt.sign({_id:user._id},process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn:'30d'});

        // database whitelist
        await JwtRefreshToken.create({token:refresh_token});
        const { password,createdAt,updatedAt,__v, ...userData } = user._doc;
        return res.status(200).json({access_token,refresh_token,userData});
    } catch (error) {
        return res.status(403).json(error);
    }
}

// logout user
const Logout = async(req,res)=>{
    // validation
    const refreshSchema = Joi.object({
        refresh_token:Joi.string(),
    });

    const {error} = refreshSchema.validate(req.body);
    if (error) {
        return res.status(401).json(error);
    }
    
    try {
        await JwtRefreshToken.deleteOne({token:req.body.refresh_token});
        return res.status(200).json('user logout');
    } catch (error) {
        return res.status(401).json(error);
    }
}

// change passowrd
const changePassword = async(req,res)=>{
    // validation
    const loginSchema = Joi.object({
        old_password:Joi.string().min(6),
        new_password:Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirm_new_password:Joi.ref('new_password'),
    });

    const {error} = loginSchema.validate(req.body);
    if (error) {
        return res.status(401).json(error);
    }

    const {old_password,new_password} = req.body;
    // check the user in database
    try {
        const user = await User.findById(req.params.userId);
        // compare the password
        const result = await bcrypt.compare(old_password,user.password);
        // if password is match then chnage the password
        if(result){
            // hash the password
            const hashedPassword = await bcrypt.hash(new_password,10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json("Password Changed");
        }else{
            return res.status(401).json("Invalid old password");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

// reset password
// send email for reset the password
const sendResetPassword = async(req,res)=>{
    // validation
    const resetPasswordSchema = Joi.object({
        email:Joi.string().email().required(),
    });

    const {error} = resetPasswordSchema.validate(req.body);
    if (error) {
        return res.status(401).json(error);
    }
    try {
        const user = await User.findOne({email:req.body.email});
        if (user) {
            // genrate token
            const token = crypto.randomBytes(64).toString('hex');
            await UserVerifyToken({token:token,email:req.body.email}).save();
            // send email
            sendResetPasswordEmail(req.body.email,token);
            return res.status(200).json("Email has been sent Please check your email");
        }else{
            return res.status(401).json("user not found");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
    
}

// get confirm reset password
const getResetPassword = async(req,res)=>{
    // validation
    const registerSchema = Joi.object({
        password:Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password:Joi.ref('password')
    });

    const{error} = registerSchema.validate(req.body);
    if(error){
        return res.status(500).json(error);
    }

    const token = req.query.token;
    const newPassword = req.body.password;

    try {
        const checkToken = await UserVerifyToken.findOne({token:token});
        if (checkToken) {
            try {
                const user = await User.findOne({email:checkToken.email});
                await UserVerifyToken.findOneAndDelete({token:token});
                // hash the password
                const hashedPassword = await bcrypt.hash(newPassword,10);
                await User.findByIdAndUpdate(user._id,{password:hashedPassword});
                return res.status(200).json("Reset password successfully");
            } catch (error) {
                return res.status(500).json(error);
            }  
        }else{
            return res.status(404).json("Invalid token");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports = {Register,Login,Logout,changePassword,sendResetPassword,getResetPassword};