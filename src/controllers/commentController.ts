import { assert } from "superstruct";
import * as commentService from "../services/commentService.js";
import { CreateComment, PatchComment } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCommentsByProductId = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { cursor } = req.query;
  const comments = await commentService.getCommentsByProductId(productId, cursor);
  res.send(comments);
});

export const getCommentsByArticleId = asyncHandler(async (req, res) => {
  const { id: articleId } = req.params;
  const { cursor } = req.query;
  const comments = await commentService.getCommentsByArticleId(articleId, cursor);
  res.send(comments);
});

export const createComment = asyncHandler(async (req, res) => {
  assert(req.body, CreateComment);

  const { userId } = req;

  const commentData = {
    ...req.body,
    ...req.params,
    userId,
  };

  const comment = await commentService.createComment(commentData);
  res.status(201).send(comment);
});

export const updateComment = asyncHandler(async (req, res) => {
  assert(req.body, PatchComment);

  const { userId } = req;
  const { content } = req.body;
  const { commentId } = req.params;

  try {
    const updatedComment = await commentService.updateComment(commentId, userId, content);
    res.send(updatedComment);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req;

  try {
    await commentService.deleteComment(commentId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});
