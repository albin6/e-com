import express from "express";
import {
  admin_login,
  admin_logout,
  create_admin,
  new_access_token_generate,
  get_users_list,
  update_user_status,
} from "../controllers/admin_controller.js";
import {
  get_all_categories,
  add_new_category,
  update_category,
  update_category_status,
} from "../controllers/category_controller.js";
import {
  add_new_brand,
  get_all_brands,
  update_brand_status,
  update_brand,
} from "../controllers/brand_controller.js";
import {
  add_new_product,
  get_product,
  get_products_details,
  update_product_details,
  update_product_status,
} from "../controllers/products_controller.js";
import { authenticate_admin_token } from "../middleware/authenticate_admin_token.js";
import { upload, upload_prodcuct } from "../utils/multer/multer.js";
const admin_router = express.Router();

// admin login / logout
admin_router.post("/login", admin_login);
admin_router.post("/logout", admin_logout);
// -------------------------------------------------------

// users
admin_router
  .route("/users-list")
  .get(authenticate_admin_token, get_users_list)
  .patch(authenticate_admin_token, update_user_status);
// -------------------------------------------------------

// categories
admin_router
  .route("/categories")
  .get(authenticate_admin_token, get_all_categories)
  .post(authenticate_admin_token, add_new_category)
  .put(authenticate_admin_token, update_category)
  .patch(authenticate_admin_token, update_category_status);
// -------------------------------------------------------

admin_router
  .route("/brands")
  .get(authenticate_admin_token, get_all_brands)
  .post(authenticate_admin_token, upload, add_new_brand)
  .patch(authenticate_admin_token, update_brand_status)
  .put(authenticate_admin_token, upload, update_brand);
// -------------------------------------------------------

admin_router
  .route("/products")
  .get(authenticate_admin_token, get_products_details)
  .post(authenticate_admin_token, upload_prodcuct, add_new_product);

// -------------------------------------------------------

admin_router
  .route("/products/:productId")
  .get(authenticate_admin_token, get_product)
  .put(authenticate_admin_token, upload_prodcuct, update_product_details)
  .patch(authenticate_admin_token, update_product_status);

// -------------------------------------------------------
// -------------------------------------------------------
// create admin
admin_router.post("/create", create_admin);
// generate new access token
admin_router.post("/token", new_access_token_generate);

export default admin_router;
