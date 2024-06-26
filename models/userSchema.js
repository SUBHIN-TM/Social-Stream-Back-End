import mongoose from "../Utilities/mongodb.js";

const postSchema = new mongoose.Schema({
    postName: { type: String },
    postImage: { type: String },
    publicId: { type: String },
    notifications: [{
        message: { type: String },
        time: { type: String },
    }],
    likes: [{ type: String }],
    comments: [{
        name: { type: String },
        content: { type: String },
        userRef: { type: String }
    }]
}, { timestamps: true },{versionKey:false});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true,unique:true},
    password: { type: String, required: true },
    mail:{type:String,unique:true,required:true},
    profileImage:{type:String, default:'https://res.cloudinary.com/dsgctlkzt/image/upload/v1710821914/Social%20Stream%20Feeds/ls75n02d10ebk3xufxwc.jpg'},
    posts:[postSchema],
    followers:[{name:{type:String},
                userRef:{type:String}
               }],
    following:[{name:{type:String},
               userRef:{type:String}
               }]
   
},{versionKey:false});
const User=mongoose.model('User',userSchema,'User');

export default User;
