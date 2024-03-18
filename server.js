import express from "express"
import cors from "cors"
import user from "./routers/user.js"



const app=express()
const port=3000

app.use(express.json())
app.use(cors())
app.use('/',user)

app.listen(port,()=>{
    console.log("Server is running on 3000");
})