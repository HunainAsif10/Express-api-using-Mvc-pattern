import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const MONGO_URL=process.env.MONGO_URL;



const connectToDb=()=>{
    mongoose.connect(MONGO_URL);
    console.log(`DataBase Connected at url ${MONGO_URL}`)
}

export default connectToDb;