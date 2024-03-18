import mongoose from "../Utilities/mongodb.js";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true,unique:true},
    password: { type: String, required: true },
    mail:{type:String,unique:true,required:true},
    profileImage:{type:String},
    posts:[{postName:{type:String},
            postImage:{type:String},
            publicId:{type:String},
            likes:{type:Number},
            comments:[{mail:{type:String}},
                      {text:{type:String}},
                      {userRef:{type:String}}
                     ]            
           }],
    followers:[{name:{type:String},
                userRef:{type:String}
               }],
    following:[{name:{type:String},
               userRef:{type:String}
               }]
   
},{versionKey:false});
const User=mongoose.model('User',userSchema,'User');

export default User;
