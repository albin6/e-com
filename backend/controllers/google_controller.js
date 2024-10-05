import AsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";
import RefreshToken from "../models/refreshTokenModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt/generateToken.js";
import { set_token } from "../utils/jwt/setCookie.js";
const client = new OAuth2Client();

export const google_authentication = AsyncHandler(async (req, res) => {
  const { credential, client_id } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: client_id,
  });

  const payload = ticket.getPayload();
  const user_id = payload["sub"]; // Google's user id
  const email = payload["email"]; // User's email from Google
  const name = payload["name"]; // User's name from Google
  const picture = payload["picture"]; // User's profile picture URL

  // Check if the user already exists in the database
  let user = await User.findOne({ email });

  if (!user) {
    const new_user = await User.create({
      googleId: user_id,
      email,
      first_name: name,
      image_url: picture,
    });

    const user_data = {
      _id: user._id,
      email: user.email,
    };

    const access_token = generateAccessToken(user_data);
    const refresh_token = generateRefreshToken(user_data);

    const new_refresh_token = new RefreshToken({
      token: refresh_token,
      user: new_user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await new_refresh_token.save();

    set_token("user_refresh_token", refresh_token, 24 * 60 * 60 * 1000, res);

    res.json({
      success: true,
      access_token,
      user: {
        id: new_user._id,
        name: new_user.first_name,
        email: new_user.email,
      },
    });
  }
});
