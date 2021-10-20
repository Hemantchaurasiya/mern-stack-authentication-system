const User = require("../models/User-model");
const UserVerifyToken = require("../models/User-verify-token-model");

// verify email then register the user
const verifyRegisterEmail = async(req,res)=>{
    const token = req.query.token;
    if (token) {
        const checkToken = await UserVerifyToken.findOne({token:token});
        if (checkToken) {
            const userData = await User.findOne({email:checkToken.email});
            userData.isVerified = true;
            await userData.save();
            await UserVerifyToken.findOneAndDelete({token:token});
            return res.status(200).json("your email verification successfull");
        }
    }else{
        return res.status(404).json("your token has been expired");
    }
}

module.exports = {verifyRegisterEmail};