import express from "express";
import { login } from "../controllers/admin_controller.js";
const admin_router = express.Router();

admin_router.post("/login", login);

export default admin_router;
