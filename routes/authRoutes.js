import express from "express";
import passport from "../config/passport.js";
import { googleCallback, refreshToken, signIn, signUp } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/signUp", asyncHandler(signUp));
router.post("/signIn", asyncHandler(signIn));
router.post("/refresh-token", asyncHandler(refreshToken));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleCallback);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
