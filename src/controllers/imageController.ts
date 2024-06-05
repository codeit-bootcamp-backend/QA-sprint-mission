import { Request, Response } from "express";
import * as imageService from "../services/imageService";

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const presignedUrl = await imageService.generatePresignedUrl(req);
    res.status(200).json({ url: presignedUrl });
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};
