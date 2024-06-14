import { Request, Response } from 'express';
import { Comment_delete } from './repository/Comment_delete';
import { Comment_update } from './repository/Comment_update';

export function updateComment(req: Request, res: Response) {
	Comment_update(req, res);
}

export function deleteComment(req: Request, res: Response) {
	Comment_delete(req, res);
}
