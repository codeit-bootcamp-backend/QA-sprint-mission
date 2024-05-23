import { Comment_delete } from "./repository/Comment_delete.js";
import { Comment_update } from "./repository/Comment_update.js";

export function updateComment(req, res) {
  Comment_update(req, res);
}

export function deleteComment(req, res) {
  Comment_delete(req, res);
}
