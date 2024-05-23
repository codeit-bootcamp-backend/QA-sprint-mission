import { object, string, define } from "superstruct";
import isUuid from "is-uuid";

const Uuid = define("Uuid", (value) => isUuid.v4(value));

export const CreateComment = object({
  ownerId: Uuid,
  content: string(),
});

export const PatchComment = partial(CreateComment);
