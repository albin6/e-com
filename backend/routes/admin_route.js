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
} from "../controllers/category_controller.js";
import { authenticate_admin_token } from "../middleware/authenticate_admin_token.js";
const admin_router = express.Router();

// admin login / logout
admin_router.post("/login", admin_login);
admin_router.post("/logout", admin_logout);

// users
admin_router
  .route("/users-list")
  .get(authenticate_admin_token, get_users_list)
  .patch(authenticate_admin_token, update_user_status);

// categories
admin_router
  .route("/categories")
  .get(authenticate_admin_token, get_all_categories)
  .post(authenticate_admin_token, add_new_category);

admin_router
  .route("/categories/:id")
  .put(authenticate_admin_token, update_category);

// ---------------------------------------------------
// create admin
admin_router.post("/create", create_admin);
// generate new access token
admin_router.post("/token", new_access_token_generate);

export default admin_router;
