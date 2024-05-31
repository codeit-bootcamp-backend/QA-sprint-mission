import { PrismaClient, User as PrismaUser } from "@prisma/client";
import dotenv from "dotenv";
import { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";

dotenv.config();
const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

interface UserWithTokens extends PrismaUser {
  accessToken: string;
  refreshToken: string;
  username: string;
  _id?: number;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      const { id, displayName, emails } = profile;

      try {
        let user = await prisma.user.findUnique({
          where: { googleId: id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: id,
              email: emails && emails[0] ? emails[0].value : "",
              name: displayName || "",
              nickname: displayName || "",
              password: null,
            },
          });
        }

        const accessTokenJwt = generateAccessToken(user);
        const refreshTokenJwt = generateRefreshToken(user);

        const userWithTokens: UserWithTokens = {
          ...user,
          accessToken: accessTokenJwt,
          refreshToken: refreshTokenJwt,
          username: displayName || "",
          _id: user.id,
        };

        done(null, userWithTokens);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
