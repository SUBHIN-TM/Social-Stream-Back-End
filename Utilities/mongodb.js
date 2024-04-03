import mongoose from "mongoose";
import env from "dotenv"
env.config()


//  export let connect=()=>{
//     mongoose.connect(process.env.MONGOPASSWORD);
// }

mongoose.connect(process.env.MONGOPASSWORD,{
    
});


const customConnection = mongoose.connection
customConnection.on('error',console.error.bind(console,'MongoDB Connection Error'));
customConnection.once('open',() => {
    console.log("MongoDb Connected Successfully");
});

export default mongoose;



