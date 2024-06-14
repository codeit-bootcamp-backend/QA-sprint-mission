/**
 * @openapi
 * components:
 *   schemas:
 *     SignUpRequestBody:
 *       type: object
 *       properties:
 *         email:
 *           $ref: '#/components/schemas/Email'
 *         nickname:
 *           $ref: '#/components/schemas/Nickname'
 *         passwordConfirmation:
 *           $ref: '#/components/schemas/Password'
 *         password:
 *           $ref: '#/components/schemas/Password'
 *
 *     SignInRequestBody:
 *       type: object
 *       properties:
 *         email:
 *           $ref: '#/components/schemas/Email'
 *         nickname:
 *           $ref: '#/components/schemas/Nickname'
 *
 *
 *
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "accessToken"
 *         refreshToken:
 *           type: string
 *           example: "refreshToken"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               $ref: '#/components/schemas/Uuid'
 *             email:
 *               $ref: '#/components/schemas/Email'
 *             image:
 *               type: string
 *               nullable: true
 *               example: null
 *             nickname:
 *               $ref: '#/components/schemas/Nickname'
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             createdAt:
 *               type: string
 *               format: date-time
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
