/**
 * @openapi
 * components:
 *   schemas:
 *     ProductBaseResponse:
 *       type: object
 *       properties:
 *         createdAt:
 *           type: string
 *           format: date-time
 *         favoriteCount:
 *           type: integer
 *           format: int32
 *         ownerId:
 *           $ref: '#/components/schemas/Uuid'
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
 *         id:
 *           $ref: '#/components/schemas/Uuid'
 *     ProductBaseRequest:
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
 *     SearchProductAll:
 *       type: object
 *       properties:
 *         totalCount:
 *           type: number
 *           default: 0
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductBaseResponse'
 *     SearchProductSome:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductBaseResponse'
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
 *     SearchProductProductIdPath:
 *       in: path
 *       name: productId
 *       schema:
 *         $ref: '#/components/schemas/Uuid'
 *       required: true
 */
