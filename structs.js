import * as s from "superstruct";

export const CreateProduct = s.object({
  ownerId: s.number(),
  images: s.array(s.string()),
  tags: s.array(s.string()),
  price: s.refine(s.number(), (price) => price > 0 && price < 1000000000),
  description: s.string(),
  name: s.string(),
});

export const PatchProduct = s.partial(CreateProduct);
