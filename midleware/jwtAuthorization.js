import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()

    const authorization = (req,res,next) =>  {
     const authHeader = req.headers['authorization'];
     if(typeof authHeader !== 'undefined'){
     next()
     }else{
        return res.status(403).json({noAuth:true})
     }
    }

export default authorization;