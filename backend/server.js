import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/connectDB.js'
import user_router from './routes/user_route.js'
const app = express()

dotenv.config()
connectDB()

app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())

app.use('/', user_router)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))