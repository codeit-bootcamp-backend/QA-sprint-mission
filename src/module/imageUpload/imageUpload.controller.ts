import { Request, Response, Router } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config({
	path: './',
	node_env: process.env.NODE_ENV || 'development',
});

const credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
};

const s3 = new S3Client({
	credentials,
	region: 'ap-northeast-2',
});

const upload = multer({
	storage: multerS3({
		s3,
		bucket: process.env.S3_BUCKET_NAME as string,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: (
			req: Request,
			file: Express.Multer.File,
			cb: (error: any, key?: string) => void,
		) => {
			cb(null, Date.now().toString() + file.originalname);
		},
	}),
});

const imageRoutes = Router();

export default imageRoutes;

/**
 * @openapi
 * '/images/upload':
 *   post:
 *     tags:
 *     - Images
 *     security:
 *       - bearerAuth: []
 *     description: 이미지 업로드, 프로젝트에 저장하는 이미지들은 이 엔드포인트를 통해 업로드한 후 URL을 획득하여 사용합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 description: 이미지 파일, 최대 용량은 5MB입니다.
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                fileUrls:
 *                  type: array
 *                  items:
 *                    type: string
 *
 *
 */

// imageRoutes.post(
// 	'',
// 	upload.array('images', 10),
// 	asyncHandler((req: Request, res: Response) => {
// 		try {
// 			const fileList = req.files as Express.Multer.File[];

// 			const fileUrls = fileList.map((file) => {
// 				return `${req.protocol}://${req.get('host')}/images/${file.filename}`;
// 			});

// 			res.send({
// 				fileUrls: fileUrls,
// 			});
// 		} catch (error: any) {
// 			res.status(400).send({ error: error.message });
// 		}
// 	}),
// );

imageRoutes.post(
	'/upload',
	upload.array('images', 10),
	(req: Request, res: Response) => {
		try {
			const files = req.files as Express.MulterS3.File[];
			const locations = files.map((file) => file.location);
			res
				.status(200)
				.send({ message: 'Files uploaded successfully!', locations });
		} catch (error) {
			res.status(500).send({ error: 'Failed to upload files.' });
		}
	},
);
