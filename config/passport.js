import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

dotenv.config();
const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;

      try {
        let user = await prisma.user.findUnique({
          where: { googleId: id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: id,
              email: emails[0].value,
              name: displayName,
              nickname: displayName,
              password: null,
            },
          });
        }

        const accessTokenJwt = generateAccessToken(user);
        const refreshTokenJwt = generateRefreshToken(user);

        done(null, { user, accessToken: accessTokenJwt, refreshToken: refreshTokenJwt });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((userWithTokens, done) => {
  done(null, userWithTokens);
});

passport.deserializeUser((userWithTokens, done) => {
  done(null, userWithTokens);
});

export default passport;
