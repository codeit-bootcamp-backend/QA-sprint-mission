/**
 * @openapi
 * components:
 *   schemas:
 *     Id:
 *       type: integer
 *       format: int32
 *       minimum: 1
 *     Uuid:
 *       type: string
 *       format: uuid
 * 
 *     Nickname:
 *       type: string
 *       example: 닉네임
 *       minLength: 1
 *       maxLength: 20
 *     UrlType:
 *       type: string
 *       format: url
 *       example: 'https://example.com/...'
 *       pattern: ^https?://.*
 *     Password:
 *       type: string
 *       example: password
 *       minLength: 8
 *       pattern: ^([a-zA-Z0-9!@#$%^&*])+$
 *  
 *     CommentWriter:
 *       allOf:
 *         - type: object
 *           properties:
 *             image:
 *               type: string
 *         - $ref: '#/components/schemas/BoardWriter'
 * 
 * 
 *     BoardWriter:
 *       type: object
 *       properties:
 *         nickname:
 *           $ref: '#/components/schemas/Nickname'
 *         id:
 *           $ref: '#/components/schemas/Uuid'
 *           default: 'e0e72e5e-8a42-4005-9c56-e6bdee91f149'
 * 
 *     BoardContent:
 *       type: string
 *       example: '게시글 내용입니다.'
 *
 *     BoardTitle:
 *       type: string
 *       example: '게시글 제목입니다.'
 *       minLength: 1
 *       maxLength: 30  
 * 

 *     ProductName:
 *       type: string
 *       example: 상품 이름
 *       minLength: 1
 *       maxLength: 30
 *     Price:
 *       type: integer
 *       format: int32
 *       minimum: 0
 *     ErrorMessage:
 *       type: object
 *       properties:
 *         message: 
 *           type: string
 *     Tags:
 *       type: array
 *       items:
 *         type: string
 *         example: 전자제품
 *         minLength: 1
 *         maxLength: 20
 *     Images:
 *        type: array
 *        items:
 *          type: string
 *          format: url
 *          example: 'https://example.com/...'
 *          pattern: ^https?://.*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *     SearchPageQuery:
 *       in: query
 *       name: page
 *       description: 페이지 번호
 *       default: 1
 *       schema:
 *         type: number
 *         format: double
 * 
 *     SearchPageSizeQuery:
 *       in: query
 *       name: pageSize
 *       description: 페이지 당 상품 수
 *       default: 10
 *       schema:
 *         type: number
 *         format: double
 * 
 *     SearchProductsOrderByQuery:
 *       in: query
 *       name: orderBy
 *       schema:
 *         type: string
 *         enum: [favorite, recent]
 *       description: 정렬 기준
 *       default: recent
 * 
 *     SearchBoardsOrderByQuery:
 *       in: query
 *       name: orderBy
 *       schema:
 *         type: string
 *         enum: [like, recent]
 *       description: 정렬 기준
 *       default: recent
 * 
 *     SearchKeywordQuery:
 *       in: query
 *       name: keyword
 *       schema:
 *         type: string
 *       description: 검색 키워드
 * 
 * 
 */
