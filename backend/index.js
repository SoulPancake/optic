const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const pinRoute = require("./routes/pins")

app.use(express.json())
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true}
    ).then(()=>{
    console.log("MongDB connected")
}).catch((err)=>console.log(err))


app.use("/api/pins", pinRoute)

app.listen(8800,()=>{
    console.log("Backend server is running! Loony")
})