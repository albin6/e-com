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
  get_products_of_brand,
  get_products_of_category,
} from "../controllers/product_listing_controller.js";
import { authenticate_user_token } from "../middleware/authenticate_user_token.js";
import { get_all_categories } from "../controllers/category_controller.js";
import { get_all_brands } from "../controllers/brand_controller.js";
import {
  add_new_address,
  delete_address,
  get_all_addresses,
  update_address,
} from "../controllers/address_controller.js";
import { normalizeUserMiddleware } from "../middleware/normalize_user_middleware.js";
import {
  get_user_info,
  update_user_info,
} from "../controllers/profile_controller.js";
import {
  add_product_to_cart,
  check_product_variant_in_cart,
  delete_product,
  get_cart_products,
  update_product_quantity,
} from "../controllers/cart_controller.js";
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
user_router.get(
  "/get-products-of-brand/:brandId",
  authenticate_user_token,
  get_products_of_brand
);
user_router.get(
  "/get-listing-products",
  authenticate_user_token,
  get_listing_products_details
);

// ----------------------------------------------------
// ----------------------------------------------------
user_router.get(
  "/get-all-categories",
  authenticate_user_token,
  get_all_categories
);
user_router.get("/get-all-brands", authenticate_user_token, get_all_brands);

// ----------------------------------------------------
// ----------------------------------------------------

user_router.get(
  "/address",
  authenticate_user_token,
  normalizeUserMiddleware,
  get_all_addresses
);
user_router.post(
  "/address",
  authenticate_user_token,
  normalizeUserMiddleware,
  add_new_address
);
user_router
  .route("/address/:addressId")
  .put(authenticate_user_token, normalizeUserMiddleware, update_address)
  .delete(authenticate_user_token, normalizeUserMiddleware, delete_address);

// ----------------------------------------------------
// ----------------------------------------------------

user_router
  .route("/profile")
  .get(authenticate_user_token, normalizeUserMiddleware, get_user_info)
  .put(authenticate_user_token, normalizeUserMiddleware, update_user_info);

// ----------------------------------------------------
// ----------------------------------------------------

user_router.get(
  "/cart-data",
  authenticate_user_token,
  normalizeUserMiddleware,
  check_product_variant_in_cart
);

user_router
  .route("/cart")
  .get(authenticate_user_token, normalizeUserMiddleware, get_cart_products)
  .post(authenticate_user_token, normalizeUserMiddleware, add_product_to_cart);

user_router
  .route("/cart/:productSKU")
  .patch(
    authenticate_user_token,
    normalizeUserMiddleware,
    update_product_quantity
  )
  .delete(authenticate_user_token, normalizeUserMiddleware, delete_product);

// ----------------------------------------------------
// ----------------------------------------------------

user_router.post("/token", new_access_token_generate);

export default user_router;
