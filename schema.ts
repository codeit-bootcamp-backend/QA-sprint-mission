/**
 * @openapi
 * components:
 *   schemas:

 *     Test:
 *       in: query
 *       name: page
 *       description: 페이지 번호
 *       default: 1
 *       schema:
 *         type: number
 *         format: double
 * 
 * 
 *     User:
 *       type: object
 *       properties:
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         image:
 *           $ref: '#/components/schemas/UrlType'
 *         nickname:
 *           $ref: '#/components/schemas/Nickname'
 *         id:
 *           $ref: '#/components/schemas/Id'
 *     UpdateUserBody:
 *       type: object
 *       properties:
 *         image:
 *           $ref: '#/components/schemas/UrlType'
 *     UpdatePasswordBody:
 *       type: object
 *       properties:
 *         passwordConfirmation:
 *           $ref: '#/components/schemas/Password'
 *         password:
 *           $ref: '#/components/schemas/Password'
 *         currentPassword:
 *           $ref: '#/components/schemas/Password'
 *           
 *     ListProductOrder:
 *       type: string
 *       default: recent
 *       enum:
 *         - recent
 *         - favorite
 *     ProductDetailType:
 *       type: object
 *       properties:
 *         createdAt:
 *           type: string
 *           format: date-time
 *         favoriteCount:
 *           type: integer
 *           format: int32
 *         ownerId:
 *           $ref: '#/components/schemas/Id'
 *         images:
 *           $ref: '#/components/schemas/Images'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         price:
 *           $ref: '#/components/schemas/Price'
 *         description:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/ProductName'
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         isFavorite:
 *           type: boolean
 *     UpdateProductBody:
 *       type: object
 *       properties:
 *         images:
 *           $ref: '#/components/schemas/Images'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         price:
 *           $ref: '#/components/schemas/Price'
 *         description:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/ProductName'
 *     CommentType:
 *       type: object
 *       properties:
 *         writer:
 *           type: object
 *           properties:
 *             nickname:
 *               $ref: '#/components/schemas/Nickname'
 *             id:
 *               $ref: '#/components/schemas/Uuid'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         content:
 *           type: string
 *         id:
 *           $ref: '#/components/schemas/Id'
 *     CreateCommentBody:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *     CursorBasedPaginationResponse_CommentType_:
 *       type: object
 *       properties:
 *         nextCursor:
 *           type: string
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CommentType'
 *     UpdateCommentBody:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *     Email:
 *       type: string
 *       format: email
 *       example: example@email.com
 *       pattern: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
 *     SignUpResponse:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *         accessToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *     SignUpRequestBody:
 *       type: object
 *       properties:
 *         passwordConfirmation:
 *           $ref: '#/components/schemas/Password'
 *         password:
 *           $ref: '#/components/schemas/Password'
 *         nickname:
 *           $ref: '#/components/schemas/Nickname'
 *         email:
 *           $ref: '#/components/schemas/Email'
 *     SignInResponse:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *         accessToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *     SignInRequestBody:
 *       type: object
 *       properties:
 *         password:
 *           $ref: '#/components/schemas/Password'
 *         email:
 *           $ref: '#/components/schemas/Email'
 *     ArticleTitle:
 *       type: string
 *       example: 게시글 제목입니다.
 *       minLength: 1
 *       maxLength: 50
 *     ArticleContent:
 *       type: string
 *       example: 게시글 내용입니다.
 *       minLength: 1
 *     ArticleWriter:
 *       type: object
 *       properties:
 *         nickname:
 *           $ref: '#/components/schemas/Nickname'
 *         id:
 *           $ref: '#/components/schemas/Id'
 *     ArticleListType:
 *       type: object
 *       properties:
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         likeCount:
 *           type: integer
 *           format: int32
 *         writer:
 *           $ref: '#/components/schemas/ArticleWriter'
 *         image:
 *           $ref: '#/components/schemas/UrlType'
 *         content:
 *           $ref: '#/components/schemas/ArticleContent'
 *         title:
 *           $ref: '#/components/schemas/ArticleTitle'
 *         id:
 *           $ref: '#/components/schemas/Id'
 *     CreateArticleBody:
 *       type: object
 *       properties:
 *         image:
 *           $ref: '#/components/schemas/UrlType'
 *         content:
 *           $ref: '#/components/schemas/ArticleContent'
 *         title:
 *           $ref: '#/components/schemas/ArticleTitle'
 *     OffsetBasedPaginationResponse_ArticleListType_:
 *       type: object
 *       properties:
 *         totalCount:
 *           type: integer
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ArticleListType'
 *     ListArticleOrder:
 *       type: string
 *       default: recent
 *       enum:
 *         - recent
 *         - favorite
 *     ArticleDetailType:
 *       type: object
 *       properties:
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         likeCount:
 *           type: integer
 *           format: int32
 *         writer:
 *           $ref: '#/components/schemas/ArticleWriter'
 *         image:
 *           $ref: '#/components/schemas/UrlType'
 *         content:
 *           $ref: '#/components/schemas/ArticleContent'
 *         title:
 *           $ref: '#/components/schemas/ArticleTitle'
 *         id:
 *           $ref: '#/components/schemas/Id'
 *         isLiked:
 *           type: boolean
 */
