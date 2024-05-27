import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
// import log from './logger';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Panda Market API Docs',
			version,
		},
		component: {
			securitySchemas: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: [
		'../module/products/products.controller.ts',
		'../../prisma/schema.prisma',
	],
};

const swaggerSpec = swaggerJsdoc(options);

export default function swaggerDocs(app: Express, port: number) {
	// 스웨거 페이지
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// 스웨거 json 포맷
	app.get('docs.json', (req: Request, res: Response) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
}
