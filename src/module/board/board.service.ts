import { Request, Response } from 'express';
import { Board_delete } from './repository/Board_delete';
import { Board_create } from './repository/Board_create';
import { Board_update } from './repository/Board_update';
import { Board_findMany } from './repository/Board_findMany';
import { Board_findUnique } from './repository/Board_findUnique';
import { Board_likes } from './repository/Board_likes';
import { Board_dislikes } from './repository/Board_dislikes';
import { Comment_create_onBoard } from '../comment/repository/Comment_create';
import { Comment_findMany_onBoard } from '../comment/repository/Comment_findMany';
import { authChecker } from '../../helper/authChecker';

export function getBoardList(req: Request, res: Response) {
	Board_findMany(req, res);
}

export function getBoard(req: Request, res: Response) {
	Board_findUnique(req, res);
}

export function createBoard(req: Request, res: Response) {
	authChecker(req);
	Board_create(req, res);
}

export function deleteBoard(req: Request, res: Response) {
	authChecker(req);
	Board_delete(req, res);
}

export function updateBoard(req: Request, res: Response) {
	authChecker(req);
	Board_update(req, res);
}

export function likeBoard(req: Request, res: Response) {
	authChecker(req);
	Board_likes(req, res);
}

export function dislikeBoard(req: Request, res: Response) {
	authChecker(req);
	Board_dislikes(req, res);
}

export function createComment(req: Request, res: Response) {
	authChecker(req);
	Comment_create_onBoard(req, res);
}

export function getCommentList(req: Request, res: Response) {
	Comment_findMany_onBoard(req, res);
}
