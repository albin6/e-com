import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../../models/userModel.js";

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, access_token, refresh_token, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // New user, save to DB
          const newUser = new User({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName, // Changed from first_name to last_name
            image_url: profile.photos[0].value,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          user = await newUser.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
