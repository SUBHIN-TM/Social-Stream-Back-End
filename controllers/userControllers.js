import User from '../models/userSchema.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()
import cloudinary from "../Utilities/cloudinary.js"

export const home=async (req,res)=>{
    try {
        console.log("Home section");            
        let result = await User.find();
        let onlyPosts = result.flatMap((user) =>
          user.posts.map((post) => ({ ...post.toObject(), userName: user.name,mail:user.mail,userId:user._id,profileImage:user.profileImage }))
        );
        console.log(onlyPosts);
        



       

        


        if(req.token){
          return res.status(200).json({name:req.token.name,details:req.token,allPosts:onlyPosts})
        }else{
          return res.status(200).json({posts:result.posts})
        }
       
        
    } catch (error) {
        console.error("Error from Home",error)
    }
   
    return res.status(500).json({message:"Internal server error"})
}


export const login=async (req,res)=>{
    try { console.log('To Do Login Section');
    console.log(req.body);
    const mail = req.body.name
    const password = req.body.password
    const existing = await User.findOne({ mail: mail })
   
    if (!existing) {
      return res.json({ invalidUser: true })
    }
    const passwordMatch = await bcrypt.compare(password, existing.password)
    if (!passwordMatch) {
      return res.json({ passwordMissmatch: true })
    } else {
      console.log(existing);
       const payload={id:existing._id,name:existing.name,mail:existing.mail}
       let key=process.env.JWT_KEY
     let token=  jwt.sign(payload,key,{expiresIn:'24h'})
      // console.log(token);
      return res.json({ dashboard: true ,token});
    }
        
    } catch (error) {
        console.error("Error from login",error)
    }
  
    return res.status(500).json({message:"Internal server error"})
}


export const signup=async (req,res)=>{
    try {
        console.log('To Do signup Section');
        console.log(req.body);
        let { name, password, mail } = req.body;
        const existing = await User.findOne({ mail: mail })
        const existingName = await User.findOne({ name: name })
        if(existingName){
          console.log("name exist");
          return res.json({ nameExists: true })
        }
        else if (existing) {
          console.log("mail exist");
          return res.json({ mailExists: true })
        } 
        else 
        {
          password = await bcrypt.hash(password, 10)
          const user = new User({
            name,
            password,
            mail,
          });
          const result = await user.save();
          console.log("Registered", result);
          return res.json({ registered: true, result });
        }
    
        
    } catch (error) {
        console.error("Error from signup",error)
    }
 
    return res.status(500).json({message:"Internal server error"})
}



export const profile=async (req,res)=>{
    try {
        console.log("Profile section");
        const response=await User.findOne({mail:req.token.mail})
        // console.log(response);
        return res.status(200).json({profileDetails:response})   
    } catch (error) {
        console.error("Error from profile",error)
        return res.status(500).json({message:"Internal server error"})
    }
   
}



export const uploadPost=async (req,res)=>{
  try {
      console.log("upload section");
      const {id} =req.token
      const {path} =req.file
      const {title}=req.body
      console.log(path,title);
      const cloudinaryResult = await cloudinary.uploader.upload(path, { folder: 'Social Stream Feeds' });
      if(cloudinaryResult){
        console.log("succesfully saved in cloudinary",cloudinaryResult);
      }else{
        return res.status(400).json({message:"cant add image now"})
      }

      const user=await User.findOne({_id:id})
      if(user){
       user.posts.push({
        postName:title,
        postImage:cloudinaryResult.secure_url,
        publicId:cloudinaryResult.public_id
       });
       let result=await user.save();
      //  let newPost=result.posts[result.posts.length -1]
       console.log(result);
       return res.status(200).json({message:"Post Added Successfully",result})
      }else{
        console.log("User not found");
        return res.status(404).json({message:"User not found"})    
      }
    
  } catch (error) {
      console.error("Error from upload",error)
      return res.status(500).json({message:"Internal server error"})
  }
 
}


export const profilePicture=async (req,res)=>{
  try {
      console.log("profilePicture section");
      const {id} =req.token
      const {path} =req.file
      console.log(req.file);
      const cloudinaryResult = await cloudinary.uploader.upload(path, { folder: 'Social Stream Feeds' });
      if(cloudinaryResult){
        console.log("succesfully saved in cloudinary",cloudinaryResult);
      }else{
        return res.status(400).json({message:"cant add image now"})
      }

      const user=await User.findOne({_id:id})
      if(user){
       user.profileImage=cloudinaryResult.secure_url;   
       let result=await user.save();
       console.log(result);
       return res.status(200).json({message:"Profile Picture Changed"})
      }else{
        console.log("User not found");
        return res.status(404).json({message:"User not found"})    
      }
    
  } catch (error) {
      console.error("Error from profilePicture",error)
      return res.status(500).json({message:"Internal server error"})
  }
 
}
