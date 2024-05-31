import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { assert } from "superstruct";
import * as articleService from "../services/articleService";
import { CreateArticle, PatchArticle } from "../structs";
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

// GET /articles
export const getArticles = async (req: Request<{}, {}, {}, GetArticlesQuery>, res: Response) => {
  const { offset = "0", limit = "10", orderBy = "recent", keyword = "" } = req.query;
  const offsetNumber = parseInt(offset, 10);
  const limitNumber = parseInt(limit, 10);
  const articles = await articleService.getArticles({ offset: offsetNumber, limit: limitNumber, orderBy, keyword });
  const bestArticles = await articleService.getBestArticles();
  res.send({ articles, bestArticles });
};

// POST /articles
export const createArticle = async (req: UserRequest, res: Response) => {
  assert(req.body, CreateArticle);
  const { userId } = req;

  const articleData: Omit<Prisma.ArticleCreateInput, "user"> = req.body;

  const article = await articleService.createArticle(userId, articleData);
  res.status(201).send(article);
};

// GET /articles/:id
export const getArticleById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);
  res.send(article);
};

// PATCH /articles/:id
export const updateArticle = async (req: UserRequest & Request<{ id: string }>, res: Response): Promise<void> => {
  assert(req.body, PatchArticle);
  const { id: articleId } = req.params;
  const { userId } = req;
  try {
    const updatedArticle = await articleService.updateArticle(articleId, userId, req.body);
    res.send(updatedArticle);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    throw error;
  }
};

// DELETE /articles/:id
export const deleteArticle = async (req: UserRequest & Request<{ id: string }>, res: Response): Promise<void> => {
  const { id: articleId } = req.params;
  const { userId } = req;
  try {
    await articleService.deleteArticle(articleId, userId);
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    throw error;
  }
};

// POST /articles/:id/like
export const likeArticle = async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id: articleId } = req.params;
  const { userId } = req;
  try {
    const updatedArticle = await articleService.likeArticle(articleId, userId);
    res.send(updatedArticle);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};

// POST /articles/:id/unlike
export const unlikeArticle = async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id: articleId } = req.params;
  const { userId } = req;
  try {
    const updatedArticle = await articleService.unlikeArticle(articleId, userId);
    res.send(updatedArticle);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
};
