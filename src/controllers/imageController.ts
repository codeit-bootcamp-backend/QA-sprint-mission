import { NextFunction, Request, Response } from "express";
import * as imageService from "../services/imageService";
import asyncHandler from "../utils/asyncHandler";

export const getPresignedUrl = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const presignedUrl = await imageService.generatePresignedUrl(req);
  res.status(200).json({ url: presignedUrl });
});
