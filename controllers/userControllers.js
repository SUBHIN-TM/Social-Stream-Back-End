import User from '../models/userSchema.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()
import cloudinary from "../Utilities/cloudinary.js"

export const home = async (req, res) => {
  try {
    console.log("Home section");
    let result = await User.find();
    let onlyPosts = result.flatMap((user) =>
      user.posts.map((post) => ({ ...post.toObject(), userName: user.name, mail: user.mail, userId: user._id, profileImage: user.profileImage }))
    );
    let latest=onlyPosts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  
    // console.log(latest);
    if (req.token) {
      return res.status(200).json({ name: req.token.name, details: req.token, allPosts: latest })
    } else {
      return res.status(200).json({ allPosts: onlyPosts })
    }


  } catch (error) {
    console.error("Error from Home", error)
  }

  return res.status(500).json({ message: "Internal server error" })
}


export const login = async (req, res) => {
  try {
    console.log('To Do Login Section');
    // console.log(req.body);
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
      // console.log(existing);
      const payload = { id: existing._id, name: existing.name, mail: existing.mail }
      let key = process.env.JWT_KEY
      let token = jwt.sign(payload, key, { expiresIn: '24h' })
      // console.log(token);
      return res.json({ dashboard: true, token });
    }

  } catch (error) {
    console.error("Error from login", error)
  }

  return res.status(500).json({ message: "Internal server error" })
}


export const signup = async (req, res) => {
  try {
    console.log('To Do signup Section');
    // console.log(req.body);
    let { name, password, mail } = req.body;
    const existing = await User.findOne({ mail: mail })
    const existingName = await User.findOne({ name: name })
    if (existingName) {
      console.log("name exist");
      return res.json({ nameExists: true })
    }
    else if (existing) {
      console.log("mail exist");
      return res.json({ mailExists: true })
    }
    else {
      password = await bcrypt.hash(password, 10)
      const user = new User({
        name,
        password,
        mail,
      });
      const result = await user.save();
      // console.log("Registered", result);
      return res.json({ registered: true, result });
    }


  } catch (error) {
    console.error("Error from signup", error)
  }

  return res.status(500).json({ message: "Internal server error" })
}



export const profile = async (req, res) => {
  try {
    console.log("Profile section");
    const response = await User.findOne({ mail: req.token.mail })
    // console.log(response);
    return res.status(200).json({ profileDetails: response })
  } catch (error) {
    console.error("Error from profile", error)
    return res.status(500).json({ message: "Internal server error" })
  }

}



export const uploadPost = async (req, res) => {
  try {
    console.log("upload section");
    const { id } = req.token
    const { path } = req.file
    const { title } = req.body
    // console.log(path, title);
    const cloudinaryResult = await cloudinary.uploader.upload(path, { folder: 'Social Stream Feeds' });
    if (cloudinaryResult) {
      console.log("succesfully saved in cloudinary", cloudinaryResult);
    } else {
      return res.status(400).json({ message: "cant add image now" })
    }

    const user = await User.findOne({ _id: id })
    if (user) {
      user.posts.push({
        postName: title,
        postImage: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id
      });
      let result = await user.save();
      //  let newPost=result.posts[result.posts.length -1]
      // console.log(result);
      return res.status(200).json({ message: "Post Added Successfully", result })
    } else {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" })
    }

  } catch (error) {
    console.error("Error from upload", error)
    return res.status(500).json({ message: "Internal server error" })
  }

}


export const profilePicture = async (req, res) => {
  try {
    console.log("profilePicture section");
    const { id } = req.token
    const { path } = req.file
    // console.log(req.file);
    const cloudinaryResult = await cloudinary.uploader.upload(path, { folder: 'Social Stream Feeds' });
    if (cloudinaryResult) {
      console.log("succesfully saved in cloudinary", cloudinaryResult);
    } else {
      return res.status(400).json({ message: "cant add image now" })
    }

    const user = await User.findOne({ _id: id })
    if (user) {
      user.profileImage = cloudinaryResult.secure_url;
      let result = await user.save();
      console.log(result);
      return res.status(200).json({ message: "Profile Picture Changed" })
    } else {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" })
    }

  } catch (error) {
    console.error("Error from profilePicture", error)
    return res.status(500).json({ message: "Internal server error" })
  }

}




export const addLike = async (req, res) => {
  try {
    console.log("Like section");
    let { postId, userId } = req.body
    const { name } = req.token
    // console.log(req.body);
    if(req.body.ownProfile){
     userId=req.token.id
    }
     console.log(postId, name);

    let user = await User.findOne({ _id: userId, "posts._id": postId });
    let currentPost=user.posts.filter((posts)=>posts._id == postId)
    // console.log("post",currentPost);
    let isNameExists = currentPost[0].likes.includes(name);
    if(isNameExists){
      let result = await User.findOneAndUpdate(
      { _id: userId, "posts._id": postId },
      {$pull: { "posts.$.likes": name } },
      { new: true }
    );
    // console.log(isNameExists);
    console.log("Like REMOVED");
    return res.status(200).json({ message: "Like Updated ",result })
    }else{
       let result = await User.findOneAndUpdate(
      { _id: userId, "posts._id": postId },
      { $push: { "posts.$.likes": name ,"posts.$.notifications":{message:`${name} Liked 👍 Your Post`,time: new Date().toISOString()}}},
      { new: true }
    );
    console.log("Like ADDED");
    return res.status(200).json({ message: "Like Updated ",result })
    }

  } catch (error) {
    console.error("Error from addLike", error)
    return res.status(500).json({ message: "Internal server error" })
  }

}



export const addComment = async (req, res) => {
  try {
    console.log("addComment section");
    let { postId, userId,comment } = req.body
    const { name } = req.token
    // console.log(postId, name);
    if(req.body.ownProfile){
      userId=req.token.id
     }


    let result = await User.findOneAndUpdate(
      { _id: userId, "posts._id": postId },
      {
        $push: {"posts.$.comments": { name: name,content: comment,},"posts.$.notifications":{message:`${name} Commented "${comment}" on Your Post `,time: new Date().toISOString()}}
      },
      { new: true }
    );
    
    if(result){
      console.log(result);
      return res.status(200).json({ message: "Comment Updated ",result })
    }
 
  } catch (error) {
    console.error("Error from addComment", error)
    return res.status(500).json({ message: "Internal server error" })
  }

}



export const notifications = async (req, res) => {
  try {
    console.log("notifications section");
    const response = await User.findOne({ mail: req.token.mail })
   let notificBase=[]
    let notific=response?.posts?.map((data)=>{
        return notificBase.push(data?.notifications) 
    })
    let finalAndSorted=notificBase.flat().sort((a, b) => new Date(b.time) - new Date(a.time))
    return res.status(200).json({notifications:finalAndSorted,posts:response.posts})
 
  } catch (error) {
    console.error("Error from notifications", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}



