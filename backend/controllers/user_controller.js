import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";
import RefreshToken from "../models/refreshTokenModel.js";
import validator from "validator";
import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt/generateToken.js";
import { generateOTP } from "../utils/otp/genrateOtp.js";
import send_verification_email from "../utils/nodemailer/sendVerificationEmail.js";
import {
  hash_password,
  compare_password,
} from "../utils/secure-password/password-bcrypt.js";
import { set_token } from "../utils/jwt/setCookie.js";

// Registering a new user
// POST /api/users/signup
export const register = AsyncHandler(async (req, res) => {
  console.log(req.body);
  const { first_name, last_name, email, phone_number, password } = req.body;
  const is_user_exists = await User.findOne({ email });

  if (!is_user_exists) {
    const hashed_password = await hash_password(password);
    const new_user = await User.create({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashed_password,
    });
    console.log("user registered successfully");
    const user_data = { id: new_user._id, email: new_user.email };
    const access_token = generateAccessToken(user_data);
    const refresh_token = generateRefreshToken(user_data);

    const new_refresh_token = new RefreshToken({
      token: refresh_token,
      user: new_user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 7d
    });

    await new_refresh_token.save();
    set_token("user_refresh_token", refresh_token, 24 * 60 * 60 * 1000, res);
    res.json({
      success: true,
      message: "User Registered Successfully",
      new_user: {
        id: new_user._id,
        firstName: new_user.first_name,
        lastName: new_user.last_name,
        email: new_user.email,
        phoneNumber: new_user.phone_number,
      },
      access_token,
    });
  } else {
    res.status(409).json({ message: "User Already Exists" });
    throw new Error("User Already Exists");
  }
});

// User login
// POST /api/users/login
export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const is_user_exists = await User.findOne({ email: email });
  console.log(is_user_exists);
  if (is_user_exists) {
    if (!is_user_exists.is_blocked) {
      const is_password_match = await compare_password(
        password,
        is_user_exists.password
      );
      if (is_password_match) {
        // login validation success
        // generate jwt
        const user_data = {
          id: is_user_exists._id,
          email: is_user_exists.email,
        };
        const access_token = generateAccessToken(user_data);
        const refresh_token = generateRefreshToken(user_data);

        const new_refresh_token = new RefreshToken({
          token: refresh_token,
          user: is_user_exists._id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 7d
        });

        await new_refresh_token.save();
        set_token(
          "user_refresh_token",
          refresh_token,
          24 * 60 * 60 * 1000,
          res
        );
        res.json({
          message: "Login Success",
          access_token,
          user: {
            ...user_data,
            firstName: is_user_exists.first_name,
            lastName: is_user_exists.last_name,
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "You are blocked. Not able to login",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "Credentials not found. Please create a new account.",
    });
  }
});

// generate an otp
// POST /api/user/send-otp
export const send_otp = AsyncHandler(async (req, res) => {
  const data = req.body;
  console.log("log in controller ", data.email);

  if (!validator.isEmail(data.email)) {
    return res.status(400).send({ message: "Invalid email address" });
  }

  const is_user_exists = await User.findOne({ email: data.email });
  console.log(is_user_exists);

  if (data?.user) {
    if (is_user_exists) {
      const otp = generateOTP();
      console.log(otp);

      await OTP.create({
        email: data.email,
        otp,
      });

      send_verification_email(data.email, otp);
      res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "The email is not registered" });
    }
  } else {
    if (!is_user_exists) {
      const otp = generateOTP();
      console.log(otp);

      await OTP.create({
        email: data.email,
        otp,
      });

      send_verification_email(data.email, otp);
      res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res
        .status(409)
        .json({ success: false, message: "User is already registered" });
    }
  }
});

// POST /api/users/verify-otp
export const verify_otp = AsyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  console.log(otp, email);
  const db_data = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  console.log(db_data, db_data.length);

  if (db_data.length != 0) {
    console.log(otp, db_data[0].otp);
    if (otp == db_data[0]?.otp) {
      const user = await User.findOne({ email }).select("-password");
      res.json({ success: true, message: "OTP verified successfully", user });
    } else {
      return res.json({
        invalid: true,
        message: "OTP is not valid",
      });
    }
  } else {
    return res.json({ expires: true, message: "OTP Expires" });
  }
});

// POST /api/users/reset-password
export const reset_password = AsyncHandler(async (req, res) => {
  const { id, password } = req.body;

  console.log("reset_password =>>>", id, password);

  const hashed_password = await hash_password(password);
  const user = await User.findById(id);

  user.password = hashed_password;

  await user.save();

  res.json({
    success: true,
    message: "Your password has been successfully reset.",
  });
});

// POST /api/users/logout
export const logout = AsyncHandler(async (req, res) => {
  const user_refresh_token = req.cookies["user_refresh_token"];

  await RefreshToken.deleteOne({ token: user_refresh_token });

  res.clearCookie("user_refresh_token");
  res.sendStatus(204);
});

// POST /api/users/token
export const new_access_token_generate = AsyncHandler(async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return res.status(401);
  }

  const stored_refresh_token = await RefreshToken.findOne({
    token: refresh_token,
  });
  if (!stored_refresh_token) {
    if (!(stored_refresh_token.expiresAt < new Date())) {
      // verify the refresh token and give a new access token
      jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        const new_access_token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_ACCESS_KEY,
          {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
          }
        );
        res.json({ access_token: new_access_token });
      });
    } else {
      await RefreshToken.deleteOne({ token: refresh_token });
      return res.status(403).json({ message: "Refresh Token Expired" });
    }
  } else {
    return res.status(403);
  }
});
