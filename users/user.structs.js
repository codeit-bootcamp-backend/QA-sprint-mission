import { object, string, min, array, partial, define } from "superstruct";
import isUuid from "is-uuid";

const Uuid = define("Uuid", (value) => isUuid.v4(value));

export const OwnerId = object({
  productId: Uuid,
});
