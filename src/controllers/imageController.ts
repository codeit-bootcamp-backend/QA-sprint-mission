import * as imageService from "../services/imageService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file;

  try {
    const imageUrl = await imageService.uploadImage(file);
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
