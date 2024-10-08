import express from "express";
import {
  register,
  login,
  send_otp,
  verify_otp,
  reset_password,
  logout,
} from "../controllers/user_controller.js";
import { get_all_product_details } from "../controllers/products_controller.js";
import { authenticate_user_token } from "../middleware/authenticate_user_token.js";
const user_router = express.Router();

user_router.post("/signup", register);
user_router.post("/login", login);
user_router.post("/send-otp", send_otp);
user_router.post("/verify-otp", verify_otp);
user_router.post("/reset-password", reset_password);
user_router.post("/logout", logout);

// ----------------------------------------------------
user_router.get("/get-product-details", get_all_product_details);

export default user_router;
