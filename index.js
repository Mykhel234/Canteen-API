const express = require("express")
const cors = require("cors")
const app = express()
const port = 1999
const mongoose =require("mongoose")
                //  "mongodb+srv://socialapp:today@cluster0.xd5wm.mongodb.net/socialapp?"
mongoose.connect("mongodb+srv://foodapp:today@cluster0.xd5wm.mongodb.net/foodapp?").then(()=>{
    console.log("connected")
}).catch((error)=>{
    console.log(error)
})
app.use(cors())
app.use(express.json()) 
app.use("/api/user", require("./Routes/userRoutes")); 
app.use("/api/rice", require("./Routes/riceRoute")); 
app.use("/api/soup", require("./Routes/soupRoute")); 
app.use("/api/fries", require("./Routes/friesRoute")); 
 
app.listen(port, ()=>{
    console.log("connected to port", port)
})