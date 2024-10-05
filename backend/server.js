import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import user_router from "./routes/user_route.js";
import "./utils/passport/passport.js";
import passport from "passport";
import admin_router from "./routes/admin_route.js";
import { google_authentication } from "./controllers/google_controller.js";
import path from "path";
import { fileURLToPath } from "url";

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/uploads",
  (req, res, next) => {
    console.log(`Serving static file: ${req.path}`);
    next();
  },
  express.static(path.join(__dirname, "public", "uploads"))
);

app.use("/api/users", user_router);
app.use("/api/admin", admin_router);

// API for google authentication
app.post("/google-auth", google_authentication);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
