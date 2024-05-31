import { Request, Response } from "express";
import { assert } from "superstruct";
import * as commentService from "../services/commentService";
import { CreateComment, PatchComment } from "../structs";

interface UserRequest extends Request {
  userId: number;
}

// GET /products/:id/comments
export const getCommentsByProductId = async (
  req: Request<{ id: string }, {}, {}, { cursor?: string }>,
  res: Response
) => {
  const { id: productId } = req.params;
  const { cursor } = req.query;
  const comments = await commentService.getCommentsByProductId(productId, cursor);
  res.send(comments);
};

// GET /articles/:id/comments
export const getCommentsByArticleId = async (
  req: Request<{ id: string }, {}, {}, { cursor?: string }>,
  res: Response
) => {
  const { id: articleId } = req.params;
  const { cursor } = req.query;
  const comments = await commentService.getCommentsByArticleId(articleId, cursor);
  res.send(comments);
};

// POST /comments
export const createComment = async (req: UserRequest, res: Response) => {
  assert(req.body, CreateComment);

  const { userId } = req;
  const commentData = {
    ...req.body,
    userId,
  };

  const comment = await commentService.createComment(commentData);
  res.status(201).send(comment);
};

// PATCH /comments/:commentId
export const updateComment = async (req: UserRequest & Request<{ commentId: string }>, res: Response) => {
  assert(req.body, PatchComment);

  const { userId } = req;
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

  try {
    const updatedComment = await commentService.updateComment(commentId, userId, content);
    res.send(updatedComment);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

// DELETE /comments/:commentId
export const deleteComment = async (req: UserRequest & Request<{ commentId: string }>, res: Response) => {
  const { commentId } = req.params;
  const { userId } = req;

  try {
    await commentService.deleteComment(commentId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};
