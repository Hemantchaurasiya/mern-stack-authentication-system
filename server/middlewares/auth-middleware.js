const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User-model");

dotenv.config();

const isAuthenticated = async(req,res,next)=>{
    let authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json("unAuthorized");
        next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const {_id} = await jwt.verify(token,process.env.JWT_ACCESS_TOKEN_SECRET);
        const user = await User.findOne({_id});
        // req.user= user;
        next();
    } catch (error) {
        return res.status(401).json("unAuthorized"); 
        next();
    }
}

module.exports = isAuthenticated;