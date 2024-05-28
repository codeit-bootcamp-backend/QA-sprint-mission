import { Request, Response, Router } from 'express';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // 업로드된 파일을 저장할 디렉토리 지정
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름에 현재 시간을 추가하여 고유하게 만듦
	},
});

// Multer 미들웨어 설정
export const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (10MB)
	fileFilter: (req, file, cb) => {
		if (!req.cookies.email) {
			return cb(new Error('로그인이 되어있지 않습니다'));
		}

		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('이미지 파일이 아닙니다'));
		}

		cb(null, true);
	},
});

const imageUploadRoutes = Router();

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

imageUploadRoutes.post(
	'',
	upload.array('images', 10),
	(req: Request, res: Response) => {
		try {
			const fileList = req.files as Express.Multer.File[];

			const fileUrls = fileList.map((file) => {
				return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
			});

			res.send({
				fileUrls: fileUrls,
			});
		} catch (error: any) {
			res.status(400).send({ error: error.message });
		}
	},
);

imageUploadRoutes.use((err: any, req: Request, res: Response): void => {
	if (err instanceof multer.MulterError) {
		// Multer 관련 오류 처리
		res.status(400).send({ error: err.message });
	} else if (err) {
		// 일반 오류 처리
		res.status(500).send({ error: err.message });
	}
});

export default imageUploadRoutes;
