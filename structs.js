import isEmail from "is-email";
import * as s from "superstruct";
const PositivePrice = s.refine(s.number(), "PositivePrice", (value) => value > 0 && value < 1000000000);

export const CreateProduct = s.object({
  ownerId: s.number(),
  images: s.array(s.string()),
  tags: s.array(s.size(s.string(), 1, 32)),
  price: PositivePrice,
  description: s.string(),
  name: s.size(s.string(), 1, 60),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 60),
  content: s.string(),
  imageUrl: s.optional(s.string()),
  writer: s.optional(s.string()),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.string(),
  writer: s.optional(s.string()),
});

export const PatchComment = s.partial(CreateComment);

export const CreateUser = s.object({
  email: s.define("Email", isEmail),
  password: s.size(s.string(), 1, 32),
  name: s.size(s.string(), 1, 16),
  nickname: s.size(s.string(), 1, 16),
});
