/**
 * @openapi
 * components:
 *   schemas:
 *     BoardBaseResponse:
 *       type: object
 *       properties:
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         likeCount:
 *           type: integer
 *           format: int32
 *         writer:
 *           $ref: '#/components/schemas/BoardWriter'
 *         images:
 *           $ref: '#/components/schemas/UrlType'
 *         content:
 *           $ref: '#/components/schemas/BoardContent'
 *         title:
 *           $ref: '#/components/schemas/BoardTitle'
 *         id:
 *           $ref: '#/components/schemas/Uuid'
 * 
 *     BoardBaseRequest:
 *       type: object
 *       properties:
 *         images:
 *           $ref: '#/components/schemas/UrlType'
 *         content:
 *           $ref: '#/components/schemas/BoardContent'
 *         title:
 *           $ref: '#/components/schemas/BoardTitle'
 * 
 *     SearchBoardAll:
 *       type: object
 *       properties:
 *         totalCount:
 *           type: number
 *           default: 0
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BoardBaseResponse'
 *     SearchBoardSome:
 *       allOf:
 *         - $ref: '#/components/schemas/BoardBaseResponse'
 *         - type: object
 *           properties:
 *             isFavorite:
 *               type: boolean
 *               default: true
 *  
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
 *
 *
 *
 *     SearchBoardBoardIdPath:
 *       in: path
 *       name: boardId
 *       schema:
 *         $ref: '#/components/schemas/Uuid'
 *       required: true
 *
 *
 *
 *
 *
 */
