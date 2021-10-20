const mongoose = require("mongoose");

const UserVerifyTokenSchema = new mongoose.Schema({
    token:{type:String,required:true},
    
    email:{type:String,required:true},
    
    expire:{type:Date,default:Date.now,expires:600}
});

module.exports = mongoose.model("UserVerifyToken",UserVerifyTokenSchema);