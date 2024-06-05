import { Request, Response } from "express";
import * as imageService from "../services/imageService";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const imageUrl = await imageService.uploadImage(req);
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};
