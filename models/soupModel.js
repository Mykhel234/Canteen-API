const mongoose = require("mongoose")


const soupSchema = mongoose.Schema({
    productName:{
        type:String
    },
    productBrand:{
        type:String
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
}, {timestamp:true})

module.exports = mongoose.model("soup", soupSchema)