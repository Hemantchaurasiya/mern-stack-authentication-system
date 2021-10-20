const mongoose = require("mongoose");

const JwtRefreshTokenSchema = new mongoose.Schema({
    token:{ type:String,unique:true},
    
    expire:{type:Date,default:Date.now,expires:2592000,}
    
},{timestamps:true});

module.exports = mongoose.model("JwtRefreshToken",JwtRefreshTokenSchema);