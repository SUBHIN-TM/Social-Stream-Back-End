import express from "express"
import cors from "cors"
import user from "./routers/user.js"
import  {connect} from "./Utilities/mongodb.js";



   connect()
const app=express()
const port=3000
var allowedOrigins = ['http://localhost:5173', 'https://social-stream-wine.vercel.app'];

app.use(express.json())

app.use(cors({
    origin:(origin,callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true)
        }else{
            callback(new Error('your oringin is not allowed by cors'))
        }
    }
}))


app.use('/',user)

app.listen(port,()=>{
    console.log("Server is running on 3000");
})