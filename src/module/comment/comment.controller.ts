import { Router } from 'express';
import { asyncHandler } from '../asyncHandler';
import { deleteComment, updateComment } from './comment.service';

const commentRoutes = Router();

// comment Id 입력
commentRoutes
	.route('/:id')
	.patch(asyncHandler(updateComment))
	.delete(asyncHandler(deleteComment));

export default commentRoutes;
