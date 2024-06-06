import { Request, Response } from "express";
import { assert } from "superstruct";
import * as articleService from "../services/articleService";
import { CreateArticle, PatchArticle } from "../structs";
import asyncHandler from "../utils/asyncHandler";

interface GetArticlesQuery {
  offset?: string;
  limit?: string;
  orderBy?: string;
  keyword?: string;
}

export interface UserRequest extends Request {
  userId: number;
}

// GET /articles
export const getArticles = asyncHandler(async (req: Request<{}, {}, {}, GetArticlesQuery>, res: Response) => {
  const { offset = "0", limit = "10", orderBy = "recent", keyword = "" } = req.query;
  const offsetNumber = parseInt(offset, 10);
  const limitNumber = parseInt(limit, 10);
  const articles = await articleService.getArticles({ offset: offsetNumber, limit: limitNumber, orderBy, keyword });
  const bestArticles = await articleService.getBestArticles();
  res.send({ articles, bestArticles });
});

// POST /articles
export const createArticle = asyncHandler(async (req: UserRequest, res: Response) => {
  assert(req.body, CreateArticle);
  const { userId } = req;
  const { imageUrl, ...articleData } = req.body;

  const article = await articleService.createArticle(userId!, articleData, imageUrl || "");
  res.status(201).send(article);
});

// GET /articles/:id
export const getArticleById = asyncHandler(async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);
  res.send(article);
});

// PATCH /articles/:id
export const updateArticle = asyncHandler(
  async (req: UserRequest & Request<{ id: string }>, res: Response): Promise<void> => {
    assert(req.body, PatchArticle);
    const { userId } = req;
    const { id } = req.params;
    const { imageUrl, ...articleData } = req.body;
    const updatedArticle = await articleService.updateArticle(id, userId!, articleData, imageUrl || "");
    res.send(updatedArticle);
  }
);

// DELETE /articles/:id
export const deleteArticle = asyncHandler(
  async (req: UserRequest & Request<{ id: string }>, res: Response): Promise<void> => {
    const { id: articleId } = req.params;
    const { userId } = req;
    await articleService.deleteArticle(articleId, userId);
    res.sendStatus(204);
  }
);

// POST /articles/:id/like
export const likeArticle = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  const { id: articleId } = req.params;
  const { userId } = req;
  const updatedArticle = await articleService.likeArticle(articleId, userId);
  res.send(updatedArticle);
});

// POST /articles/:id/unlike
export const unlikeArticle = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  const { id: articleId } = req.params;
  const { userId } = req;
  const updatedArticle = await articleService.unlikeArticle(articleId, userId);
  res.send(updatedArticle);
});
