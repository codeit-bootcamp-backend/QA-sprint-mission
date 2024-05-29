import { assert } from "superstruct";
import * as articleService from "../services/articleService.js";
import { CreateArticle, PatchArticle } from "../structs.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/errors.js";

export const getArticles = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, orderBy = "recent", keyword = "" } = req.query;
  const articles = await articleService.getArticles({ offset, limit, orderBy, keyword });
  const bestArticles = await articleService.getBestArticles();
  res.send({ articles, bestArticles });
});

export const createArticle = asyncHandler(async (req, res) => {
  assert(req.body, CreateArticle);
  const { userId } = req;
  const article = await articleService.createArticle({ ...req.body, userId });
  res.status(201).send(article);
});

export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);
  res.send(article);
});

export const updateArticle = asyncHandler(async (req, res, next) => {
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

export const deleteArticle = asyncHandler(async (req, res, next) => {
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
});

export const likeArticle = asyncHandler(async (req, res, next) => {
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
});

export const unlikeArticle = asyncHandler(async (req, res, next) => {
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
});
