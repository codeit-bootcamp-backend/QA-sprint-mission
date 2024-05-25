import { Router } from 'express';
import { asyncHandler } from '../asyncHandler';
import { updateComment } from './comment.service';
import { Comment_delete } from './repository/Comment_delete';

const commentRoutes = Router();

// comment Id 입력
commentRoutes
	.route('/:id')
	.patch(asyncHandler(updateComment))
	.delete(asyncHandler(Comment_delete));

export default commentRoutes;
