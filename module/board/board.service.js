import { Board_delete } from "./repository/Board_delete.js";
import { Board_create } from "./repository/Board_create.js";
import { Board_update } from "./repository/Board_update.js";
import { Board_findMany } from "./repository/Board_findMany.js";
import { Board_findUnique } from "./repository/Board_findUnique.js";

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
