import express from "express";
import {
  register,
  login,
  send_otp,
  verify_otp,
  reset_password,
  logout,
  new_access_token_generate,
} from "../controllers/user_controller.js";
import {
  get_all_products_details,
  get_product,
} from "../controllers/products_controller.js";
import {
  get_listing_products_details,
  get_products_of_category,
} from "../controllers/product_listing_controller.js";
import { authenticate_user_token } from "../middleware/authenticate_user_token.js";
import { get_all_categories } from "../controllers/category_controller.js";
import { get_all_brands } from "../controllers/brand_controller.js";
const user_router = express.Router();

user_router.post("/signup", register);
user_router.post("/login", login);
user_router.post("/send-otp", send_otp);
user_router.post("/verify-otp", verify_otp);
user_router.post("/reset-password", reset_password);
user_router.post("/logout", logout);
user_router.get("/get-products-details", get_all_products_details);

// ----------------------------------------------------
user_router.get(
  "/get-product/:productId",
  authenticate_user_token,
  get_product
);

// ----------------------------------------------------
user_router.get(
  "/get-products-of-category/:categoryId",
  authenticate_user_token,
  get_products_of_category
);

// ----------------------------------------------------
// ----------------------------------------------------
user_router.get(
  "/get-all-categories",
  authenticate_user_token,
  get_all_categories
);
user_router.get("/get-all-brands", authenticate_user_token, get_all_brands);
user_router.get(
  "/get-listing-products",
  authenticate_user_token,
  get_listing_products_details
);

// ----------------------------------------------------
// ----------------------------------------------------

user_router.post("/token", new_access_token_generate);

export default user_router;
