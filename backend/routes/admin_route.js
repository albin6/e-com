import express from "express";
import {
  admin_login,
  admin_logout,
  create_admin,
  new_access_token_generate,
} from "../controllers/admin_controller.js";
const admin_router = express.Router();

admin_router.post("/login", admin_login);
admin_router.post("/logout", admin_logout);
admin_router.post("/create", create_admin);
admin_router.post("/token", new_access_token_generate);

export default admin_router;
