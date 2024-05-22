import { object, define, union } from "superstruct";
import isUuid from "is-uuid";

const Uuid = define("Uuid", (value) => isUuid.v4(value));

export const ToggleProductLike = object({
  productId: Uuid,
  action: union(["like", "dislike"]),
});
