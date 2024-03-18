import mongoose from "mongoose";
mongoose.connect('mongodb://127.0.0.1:27017/Social-Stream',{
});

const customConnection = mongoose.connection
customConnection.on('error',console.error.bind(console,'MongoDB Connection Error'));
customConnection.once('open',() => {
    console.log("MongoDb Connected Successfully");
});

export default mongoose;



