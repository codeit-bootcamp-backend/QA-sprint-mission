import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Panda Market API Docs',
			version,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	apis: [`./src/module/**/*.controller.ts`, './src/swagger/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocsRoute = Router();

swaggerDocsRoute.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
