import { Board_delete } from "./repository/Board_delete.js";
import { Board_create } from "./repository/Board_create.js";
import { Board_update } from "./repository/Board_update.js";
import { Board_findMany } from "./repository/Board_findMany.js";
import { Board_findUnique } from "./repository/Board_findUnique.js";
import { Board_likes } from "./repository/Board_likes.js";
import { Board_dislikes } from "./repository/Board_dislikes.js";
import { Comment_create_onBoard } from "../comment/repository/Comment_create.js";
import { Comment_findMany_onBoard } from "../comment/repository/Comment_findMany.js";

export function getBoardList(req, res) {
  Board_findMany(req, res);
}

export function getBoard(req, res) {
  Board_findUnique(req, res);
}

export function createBoard(req, res) {
  Board_create(req, res);
}

export function deleteBoard(req, res) {
  Board_delete(req, res);
}

export function updateBoard(req, res) {
  Board_update(req, res);
}

export function likeBoard(req, res) {
  Board_likes(req, res);
}

export function dislikeBoard(req, res) {
  Board_dislikes(req, res);
}

export function createComment(req, res) {
  Comment_create_onBoard(req, res);
}

export function getCommentList(req, res) {
  Comment_findMany_onBoard(req, res);
}
