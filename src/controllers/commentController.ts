import { Request, Response } from "express";
import { assert } from "superstruct";
import * as commentService from "../services/commentService";
import { CreateComment, PatchComment } from "../structs";
import asyncHandler from "../utils/asyncHandler";

interface UserRequest extends Request {
  user: { _id: number };
}

// GET /products/:id/comments
export const getCommentsByProductId = asyncHandler(
  async (req: Request<{ productId: string }, {}, {}, { cursor?: string }>, res: Response) => {
    const { productId } = req.params;
    const { cursor } = req.query;
    const comments = await commentService.getCommentsByEntityId("product", productId, cursor);
    const totalCount = await commentService.getCommentsCountByEntityId("product", productId);

    res.send({ totalCount, comments });
  }
);

// GET /articles/:id/comments
export const getCommentsByArticleId = asyncHandler(
  async (req: Request<{ articleId: string }, {}, {}, { cursor?: string }>, res: Response) => {
    const { articleId } = req.params;
    const { cursor } = req.query;
    const comments = await commentService.getCommentsByEntityId("article", articleId, cursor);
    const totalCount = await commentService.getCommentsCountByEntityId("article", articleId);

    res.send({ totalCount, comments });
  }
);
// POST /comments
export const createComment = asyncHandler(async (req: UserRequest, res: Response) => {
  assert(req.body, CreateComment);
  const { productId, articleId } = req.params;
  const { _id: userId } = req.user;
  const commentData = {
    productId: productId,
    articleId: articleId,
    ...req.body,
    userId,
  };

  const comment = await commentService.createComment(commentData);
  console.log(comment);
  res.status(201).send(comment);
});

// PATCH /comments/:commentId
export const updateComment = asyncHandler(async (req: UserRequest & Request<{ commentId: string }>, res: Response) => {
  assert(req.body, PatchComment);

  const { _id: userId } = req.user;
  const { content } = req.body;
  const { commentId } = req.params;

  if (!commentId) {
    res.status(400).json({ message: "존재하지 않는 댓글입니다." });
    return;
  }

  if (!content) {
    res.status(400).json({ message: "댓글 내용은 필수값입니다." });
    return;
  }

  const updatedComment = await commentService.updateComment(commentId, userId, content);
  res.send(updatedComment);
});

// DELETE /comments/:commentId
export const deleteComment = asyncHandler(async (req: UserRequest & Request<{ commentId: string }>, res: Response) => {
  const { commentId } = req.params;
  const { _id: userId } = req.user;

  await commentService.deleteComment(commentId, userId);
  res.sendStatus(204);
});
