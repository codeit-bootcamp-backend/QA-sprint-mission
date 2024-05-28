/**
 * @openapi
 * components:
 *   schemas:
 *     CommentBaseResponse:
 *       type: object
 *       properties:
 *         writer:
 *           $ref: '#/components/schemas/CommentWriter'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         content:
 *           type: string
 *         id:
 *           $ref: '#/components/schemas/Uuid'
 * 
 *     CommentBaseRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 * 
 *     SearchCommentAll:
 *       type: object
 *       properties:
 *         nextCursor:
 *           type: number
 *           default: 0
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CommentBaseResponse'
 *       
 *     

 *     CreateProductRequestBody:
 *       type: object
 *       properties:
 *         images:
 *           $ref: '#/components/schemas/Images'
 *         tags:
 *           $ref: '#/components/schemas/Tags'
 *         price:
 *           $ref: '#/components/schemas/Price'
 *         description:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/ProductName'
 *
 *
 *
 * 
 *     SearchCommentsLimitQuery:
 *       in: query
 *       name: limit
 *       schema:
 *         type: number
 *         format: double
 *       required: true
 *
 *
 * 
 *     SearchCommentsCursorQuery:
 *       in: query
 *       name: cursor
 *       schema:
 *         type: number
 *         format: double
 *
 *
 *     SearchCommentCommentIdPath:
 *       in: path
 *       name: commentId
 *       schema:
 *         $ref: '#/components/schemas/Uuid'
 *       required: true
 *
 *
 *
 *
 *
 *
 */
