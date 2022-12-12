const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,

    },
    avatar:{
        type:String
    },
    avatarID:{
        type:String
    },
    isAdmin:{
        type:Boolean
    },
    isVerify:{
        type:String
    },
    mainOTP:{
        type:String
    },
   OTP:{
        type:String 
    },
    verifiedToken:{
        type:String 
    },
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:["soup", "rice", "fries"]
    }]
}, {timestamp:true})

module.exports=mongoose.model("user", userSchema)