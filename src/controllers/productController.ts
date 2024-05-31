import { NextFunction, Request, Response } from "express";
import { assert } from "superstruct";
import * as productService from "../services/productService";
import { CreateProduct, PatchProduct } from "../structs";

interface UserRequest extends Request {
  userId: number;
}

// GET /products
export const getProducts = async (
  req: Request<{}, {}, {}, { offset?: string; limit?: string; orderBy?: string; keyword?: string }>,
  res: Response
) => {
  const { offset = "0", limit = "10", orderBy = "recent", keyword = "" } = req.query;
  const offsetNumber = parseInt(offset, 10);
  const limitNumber = parseInt(limit, 10);
  const products = await productService.getProducts({ offset: offsetNumber, limit: limitNumber, orderBy, keyword });
  res.send(products);
};

// POST /products
export const createProduct = async (req: UserRequest, res: Response) => {
  assert(req.body, CreateProduct);
  const { userId } = req;
  const productData = {
    ...req.body,
    user: { connect: { id: userId } },
  };
  const product = await productService.createProduct(productData);
  res.status(201).send(product);
};

// GET /products/:id
export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  res.send(product);
};

// PATCH /products/:id
export const updateProduct = async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
  assert(req.body, PatchProduct);

  const { id: productId } = req.params;
  const { userId } = req;

  try {
    const updatedProduct = await productService.updateProduct(productId, userId, req.body);
    res.send(updatedProduct);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

// DELETE /products/:id
export const deleteProduct = async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id: productId } = req.params;
  const { userId } = req;

  try {
    await productService.deleteProduct(productId, userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

// POST /products/:id/like
export const likeProduct = async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id: productId } = req.params;
  const { userId } = req;

  try {
    const updatedProduct = await productService.likeProduct(productId, userId);
    res.send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// POST /products/:id/unlike
export const unlikeProduct = async (req: UserRequest & Request<{ id: string }>, res: Response, next: NextFunction) => {
  const { id: productId } = req.params;
  const { userId } = req;

  try {
    const updatedProduct = await productService.unlikeProduct(productId, userId);
    res.send(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
