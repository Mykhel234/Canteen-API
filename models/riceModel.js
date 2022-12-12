const mongoose = require("mongoose")


const riceSchema = mongoose.Schema({
    productName:{
        type:String
    },
   
    price:{
        type:Number
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    imageID:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
}, {timestamp:true})

module.exports = mongoose.model("rice", riceSchema)