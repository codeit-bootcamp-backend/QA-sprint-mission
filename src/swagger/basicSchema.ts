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
 *       example: 'e0e72e5e-8a42-4005-9c56-e6bdee91f149'
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
 */
