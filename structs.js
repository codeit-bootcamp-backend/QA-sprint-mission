import * as s from "superstruct";

const PositivePrice = s.refine(s.number(), "PositivePrice", (value) => value > 0 && value < 1000000000);

export const CreateProduct = s.object({
  ownerId: s.number(),
  images: s.array(s.string()),
  tags: s.array(s.string()),
  price: PositivePrice,
  description: s.string(),
  name: s.string(),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.string(),
  content: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.string(),
  writer: s.string(),
});

export const PatchComment = s.partial(CreateComment);
