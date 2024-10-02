import AsyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import { compare_password } from "../utils/secure-password/password-bcrypt.js";
import { generateAccessToken } from "../utils/jwt/generateToken.js";
import RefreshToken from "../models/refreshTokenModel.js";

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const is_admin_exists = await Admin.findOne({ email });

  if (!is_admin_exists) {
    return res
      .status(404)
      .json({ success: false, message: "Email Not Exists" });
  }

  if (!compare_password(password, is_admin_exists.password)) {
    return res
      .status(401)
      .json({ success: false, message: "Email or password is incorrect" });
  }

  const admin_data = { id: is_admin_exists._id, email: is_admin_exists.email };
  const access_token = generateAccessToken(admin_data);
  const refresh_token = generateAccessToken(admin_data);

  const new_refresh_token = new RefreshToken({
    token: refresh_token,
    user: is_admin_exists._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
  });

  await new_refresh_token.save();
  res.cookie("admin_refresh_token", refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
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
