import AsyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import {
  compare_password,
  hash_password,
} from "../utils/secure-password/password-bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt/generateToken.js";
import RefreshToken from "../models/refreshTokenModel.js";

export const admin_login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const is_admin_exists = await Admin.findOne({ email });

  if (!is_admin_exists) {
    return res
      .status(404)
      .json({ success: false, message: "Email Not Exists" });
  }

  console.log(await compare_password(password, is_admin_exists.password));
  if (!(await compare_password(password, is_admin_exists.password))) {
    return res
      .status(401)
      .json({ success: false, message: "Email or password is incorrect" });
  }

  const admin_data = {
    id: is_admin_exists._id,
    email: is_admin_exists.email,
    role: is_admin_exists.role,
  };
  const access_token = generateAccessToken(admin_data);
  const refresh_token = generateRefreshToken(admin_data);

  const new_refresh_token = new RefreshToken({
    token: refresh_token,
    user: is_admin_exists._id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 7d
  });

  await new_refresh_token.save();
  res.cookie("admin_refresh_token", refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
  });

  res.json({
    message: "Login Success",
    access_token,
    admin: {
      id: admin_data.id,
      email: admin_data.email,
    },
  });
});

// POST /api/admin/logout
export const admin_logout = AsyncHandler(async (req, res) => {
  const admin_refresh_token = req.cookies["admin_refresh_token"];
  console.log(admin_refresh_token);

  await RefreshToken.deleteOne({ token: admin_refresh_token });

  res.cookie("admin_refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(204).json({ success: true, message: "logout successfully" });
});

// POST /api/admin/token
export const new_access_token_generate = AsyncHandler(async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return res.status(401);
  }

  const stored_refresh_token = await RefreshToken.findOne({
    token: refresh_token,
  });
  if (!stored_refresh_token) {
    return res.status(403);
  }

  if (stored_refresh_token.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token: refresh_token });
    return res.status(403).json({ message: "Refresh Token Expired" });
  }

  jwt.verify(refresh_token, process.env.ADMIN_JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const new_access_token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ADMIN_JWT_ACCESS_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      }
    );
    res.json({ access_token: new_access_token });
  });
});

// create admin

export const create_admin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const hashed_password = await hash_password(password);
  const admin = await Admin.create({
    email,
    password: hashed_password,
  });

  res.json({
    success: true,
    message: "Login Success",
  });
});
