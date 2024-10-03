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

const app = express();

connectDB();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", user_router);
app.use("/api/admin", admin_router);

app.get(
  "/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/oauth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CORS_ALLOWED_ORIGIN}/signup`,
    successRedirect: `${process.env.CORS_ALLOWED_ORIGIN}/signup`,
  }),
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect("/");
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
