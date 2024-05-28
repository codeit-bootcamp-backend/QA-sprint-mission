import { Router } from 'express';
import { asyncHandler } from '../asyncHandler';
import { deleteComment, updateComment } from './comment.service';

const commentRoutes = Router();

/**
 * @openapi
 * '/comments/{commentId}':
 *   patch:
 *     tags:
 *     - comment
 *     parameters:
 *       - $ref: '#/components/schemas/SearchCommentCommentIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentBaseResponse'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 *   delete:
 *     tags:
 *     - comment
 *     parameters:
 *       - $ref: '#/components/schemas/SearchCommentCommentIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                  $ref: '#/components/schemas/Uuid'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */

commentRoutes
	.route('/:id')
	.patch(asyncHandler(updateComment))
	.delete(asyncHandler(deleteComment));

export default commentRoutes;
