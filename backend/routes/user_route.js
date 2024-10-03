import express from "express";
import {
  register,
  login,
  send_otp,
  verify_otp,
  logout,
} from "../controllers/user_controller.js";
import { authenticate_user_token } from "../middleware/authenticate_user_token.js";
const user_router = express.Router();

user_router.post("/signup", register);
user_router.post("/login", login);
user_router.post("/send-otp", send_otp);
user_router.post("/verify-otp", verify_otp);
user_router.post("/logout", logout);

export default user_router;
