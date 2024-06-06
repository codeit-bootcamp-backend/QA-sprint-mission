import { Request, Response } from "express";
import { assert } from "superstruct";
import * as productService from "../services/productService";
import { CreateProduct, PatchProduct } from "../structs";
import asyncHandler from "../utils/asyncHandler";

interface UserRequest extends Request {
  userId: number;
}

// GET /products
export const getProducts = asyncHandler(
  async (
    req: Request<{}, {}, {}, { offset?: string; limit?: string; orderBy?: string; keyword?: string }>,
    res: Response
  ) => {
    const { offset = "0", limit = "10", orderBy = "recent", keyword = "" } = req.query;
    const offsetNumber = parseInt(offset, 10);
    const limitNumber = parseInt(limit, 10);
    const products = await productService.getProducts({ offset: offsetNumber, limit: limitNumber, orderBy, keyword });
    const bestProducts = await productService.getBestProducts();
    res.send({ products, bestProducts });
  }
);

// POST /products
export const createProduct = asyncHandler(async (req: UserRequest, res: Response) => {
  assert(req.body, CreateProduct);
  const { userId } = req;
  const { imageUrl, ...productData } = req.body;

  const product = await productService.createProduct(userId!, productData, imageUrl || "");
  res.status(201).send(product);
});

// GET /products/:id
export const getProductById = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  res.send(product);
});

// PATCH /products/:id
export const updateProduct = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  assert(req.body, PatchProduct);

  const { userId } = req;
  const { id } = req.params;
  const { imageUrl, ...productData } = req.body;
  const updatedProduct = await productService.updateProduct(id, userId, productData, imageUrl || "");
  res.send(updatedProduct);
});

// DELETE /products/:id
export const deleteProduct = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  const { id: productId } = req.params;
  const { userId } = req;
  await productService.deleteProduct(productId, userId);
  res.sendStatus(204);
});

// POST /products/:id/like
export const likeProduct = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  const { id: productId } = req.params;
  const { userId } = req;
  const updatedProduct = await productService.likeProduct(productId, userId);
  res.send(updatedProduct);
});

// POST /products/:id/unlike
export const unlikeProduct = asyncHandler(async (req: UserRequest & Request<{ id: string }>, res: Response) => {
  const { id: productId } = req.params;
  const { userId } = req;
  const updatedProduct = await productService.unlikeProduct(productId, userId);
  res.send(updatedProduct);
});
