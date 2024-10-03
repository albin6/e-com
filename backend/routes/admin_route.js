import express from "express";
import {
  admin_login,
  admin_logout,
  create_admin,
  new_access_token_generate,
  get_users_list,
  update_user_status,
} from "../controllers/admin_controller.js";
import { authenticate_admin_token } from "../middleware/authenticate_admin_token.js";
const admin_router = express.Router();

admin_router.post("/login", admin_login);
admin_router.post("/logout", admin_logout);
admin_router
  .route("/users-list")
  .get(authenticate_admin_token, get_users_list)
  .patch(authenticate_admin_token, update_user_status);

// create admin
admin_router.post("/create", create_admin);
// generate new access token
admin_router.post("/token", new_access_token_generate);

export default admin_router;
