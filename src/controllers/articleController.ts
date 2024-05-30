import { NextFunction, Request, Response } from "express";
import { assert } from "superstruct";
import * as articleService from "../services/articleService";
import { CreateArticle, PatchArticle } from "../structs";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/errors";

interface GetArticlesQuery {
  offset?: string;
  limit?: string;
  orderBy?: string;
  keyword?: string;
}

interface UserRequest extends Request {
  userId: number;
}

interface ArticleRequest extends Request {
  userId: number;
  body: {
    title: string;
    content: string;
    imageUrl?: string;
  };
}

// GET /articles
export const getArticles = asyncHandler(async (req: Request<{}, {}, {}, GetArticlesQuery>, res: Response) => {
  const { offset = "0", limit = "10", orderBy = "recent", keyword = "" } = req.query as { [key: string]: string };
  const offsetNumber = parseInt(offset, 10);
  const limitNumber = parseInt(limit, 10);
  const articles = await articleService.getArticles({ offset: offsetNumber, limit: limitNumber, orderBy, keyword });
  const bestArticles = await articleService.getBestArticles();
  res.send({ articles, bestArticles });
});

// POST /articles
export const createArticle = asyncHandler(async (req: ArticleRequest, res: Response) => {
  assert(req.body, CreateArticle);
  const { userId } = req;
  const article = await articleService.createArticle({ ...req.body, userId });
  res.status(201).send(article);
});

// GET /articles/:id
export const getArticleById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);
  res.send(article);
});

// PATCH /articles/:id
export const updateArticle = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  assert(req.body, PatchArticle);
  const { id: articleId } = req.params;
  const { userId } = req;
  try {
    const updatedArticle = await articleService.updateArticle(articleId, userId, req.body);
    res.send(updatedArticle);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
});
// DELETE /articles/:id
export const deleteArticle = asyncHandler(
  async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id: articleId } = req.params;
    const { userId } = req;
    try {
      await articleService.deleteArticle(articleId, userId);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      next(error);
    }
  }
);

// POST /articles/:id/like
export const likeArticle = asyncHandler(
  async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id: articleId } = req.params;
    const { userId } = req;
    try {
      const updatedArticle = await articleService.likeArticle(articleId, userId);
      res.send(updatedArticle);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      next(error);
    }
  }
);

// POST /articles/:id/unlike
export const unlikeArticle = asyncHandler(
  async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id: articleId } = req.params;
    const { userId } = req;
    try {
      const updatedArticle = await articleService.unlikeArticle(articleId, userId);
      res.send(updatedArticle);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      next(error);
    }
  }
);
