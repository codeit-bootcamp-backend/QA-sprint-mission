import { Router } from "express";

import { asyncHandler } from "../asyncHandler.js";
import {
  createBoard,
  createComment,
  deleteBoard,
  dislikeBoard,
  getBoard,
  getBoardList,
  likeBoard,
  updateBoard,
} from "./board.service.js";

const boardRoutes = Router();

boardRoutes.route("/").get(asyncHandler(getBoardList)).post(asyncHandler(createBoard));
boardRoutes
  .route("/:id")
  .get(asyncHandler(getBoard))
  .delete(asyncHandler(deleteBoard))
  .patch(asyncHandler(updateBoard));

boardRoutes.route("/:id/comment").post(asyncHandler(createComment));
boardRoutes.route("/:id/like").patch(asyncHandler(likeBoard));
boardRoutes.route("/:id/dislike").patch(asyncHandler(dislikeBoard));

export default boardRoutes;
