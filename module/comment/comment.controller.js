import { Router } from "express";

import { asyncHandler } from "../asyncHandler.js";
import { updateComment } from "./comment.service.js";
const commentRoutes = Router();

// comment Id 입력
commentRoutes.route("/:id").patch(asyncHandler(updateComment));

export default commentRoutes;
