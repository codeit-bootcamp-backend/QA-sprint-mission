/**
 * @openapi
 * components:
 *   schemas:
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
 *
 *
 *
 *
 *
 *     UpdatePassword:
 *       type: object
 *       properties:
 *         passwordConfirmation:
 *           $ref: '#/components/schemas/Password'
 *         password:
 *           $ref: '#/components/schemas/Password'
 *         currentPassword:
 *           $ref: '#/components/schemas/Password'
 *
 *
 *
 *
 *
 *
 *
 */
