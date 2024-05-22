import { object, string, min, array, partial, define } from "superstruct";
import isUuid from "is-uuid";

const Uuid = define("Uuid", (value) => isUuid.v4(value));

export const CreateProduct = object({
  ownerId: Uuid,
  name: string(),
  description: string(),
  price: min(string(), 0),
  tags: array(string()),
  images: array(string()),
});

export const PatchProduct = partial(CreateProduct);
