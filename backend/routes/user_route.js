import express from "express";
import {
  register,
  login,
  send_otp,
  verify_otp,
  logout,
} from "../controllers/user_controller.js";
import { authenticate_token } from "../middleware/authenticateToken.js";
const user_router = express.Router();

user_router.post("/signup", register);
user_router.post("/login", login);
user_router.post("/send-otp", send_otp);
user_router.post("/verify-otp", verify_otp);
user_router.post("/logout", authenticate_token, logout);

export default user_router;
