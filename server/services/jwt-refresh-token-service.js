const Joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User-model");
const JwtRefreshToken = require("../models/Jwt-refresh-token-model");

dotenv.config();

const refreshTokenController = async(req,res)=>{
    // validation
    const refreshSchema = Joi.object({
        refresh_token:Joi.string().required(),
    });

    const {error} = refreshSchema.validate(req.body);

    if(error){
        return res.status(500).json(error);
    }
    let old_refresh_token = req.body.refresh_token;
    // database
    let refreshtoken;
    try {
        refreshtoken = await JwtRefreshToken.findOne({token:old_refresh_token});
        
        if(!refreshtoken){
            return res.status(401).json("Invalid refresh token");
        }

        let userId;
        try {
            const {_id} = await jwt.verify(refreshtoken.token,process.env.JWT_REFRESH_TOKEN_SECRET);
            userId = _id;
        } catch (error) {
            return res.status(500).json("Invalid refresh token");
        }
        
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json('User Not Found');
        }

        // token
        const access_token = jwt.sign({_id:user._id},process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn:'60s'});
        const refresh_token = jwt.sign({_id:user._id},process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn:'30d'});

        // database whitelist
        await JwtRefreshToken.findOneAndUpdate({token:old_refresh_token},{token:refresh_token});
        return res.status(200).json({access_token,refresh_token});
    } catch (error) {
        return res.status(500).json("Something went wrong");
    }
}

module.exports = refreshTokenController;