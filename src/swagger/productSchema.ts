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
 *     SearchProductsPageQuery:
 *       in: query
 *       name: page
 *       description: 페이지 번호
 *       default: 1
 *       schema:
 *         type: number
 *         format: double
 *     SearchProductsPageSizeQuery:
 *       in: query
 *       name: pageSize
 *       description: 페이지 당 상품 수
 *       default: 10
 *       schema:
 *         type: number
 *         format: double
 *     SearchProductsOrderByQuery:
 *       in: query
 *       name: orderBy
 *       schema:
 *         type: string
 *         enum: [favorite, recent]
 *       description: 정렬 기준
 *       default: recent
 *     SearchProductsKeywordQuery:
 *       in: query
 *       name: keyword
 *       schema:
 *         type: string
 *       description: 검색 키워드
 *     SearchProductProductIdPath:
 *       in: path
 *       name: productId
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
