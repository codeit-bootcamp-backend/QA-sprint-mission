import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './module/auth/auth.controller';
import productRoutes from './module/products/products.controller';
import boardRoutes from './module/board/board.controller';
import commentRoutes from './module/comment/comment.controller';
import { authValidate } from './helper/jwt';
import imageUploadRoutes from './module/imageUpload/imageUpload.controller';
import userRouters from './module/user/user.controller';
import swaggerDocs from './helper/swagger';

dotenv.config();
const app = express();

// app.use(
// 	cors({
// 		origin: ['http://localhost:3001'],
// 	}),
// );
app.use(express.json());
app.use(cookieParser());

app.use(authValidate);

app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRouters);
app.use('/boards', boardRoutes);
app.use('/comments', commentRoutes);
app.use('/upload', imageUploadRoutes);

app.listen(process.env.PORT || 3000, () => {
	console.log('Server Started');
	swaggerDocs(app);
});
