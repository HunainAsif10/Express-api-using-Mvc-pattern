import express from "express"
const app=express()
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
const PORT=process.env.PORT;
import user from "./routes/user.js"
import connectToDb from "./db.js"
connectToDb();

app.use(cors())
app.use(express.json())


app.use("/user",user)



app.listen(PORT,()=>console.log(`Server is listening on port ${PORT}`))