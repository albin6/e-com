import express from 'express'
import { home } from '../controllers/user_controller.js'
const user_router = express.Router()

user_router.get('/', home)

export default user_router