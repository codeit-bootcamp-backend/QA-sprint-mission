import { object, string, array, partial, define } from "superstruct";
import isUuid from "is-uuid";

const Uuid = define("Uuid", (value) => isUuid.v4(value));

export const CreateBoard = object({
  title: string(),
  content: string(),
  imageUrl: array(string()),
});

export const PatchBoard = partial(CreateBoard);
