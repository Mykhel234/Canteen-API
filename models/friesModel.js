const mongoose = require("mongoose")


const friesSchema = mongoose.Schema({
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

module.exports = mongoose.model("fries", friesSchema)