import { Router } from 'express';
import { asyncHandler } from '../asyncHandler';
import { signIn, signOut, signUp } from './auth.service';

const authRoutes = Router();

authRoutes.route('/signUp').post(asyncHandler(signUp));
authRoutes.route('/signIn').post(asyncHandler(signIn));
authRoutes.route('/signOut').delete(asyncHandler(signOut));
// authRoutes.route('/refresh-token').post(asyncHandler());

export default authRoutes;
