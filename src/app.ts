import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './module/auth/auth.controller';
import productRoutes from './module/products/products.controller';
import boardRoutes from './module/board/board.controller';
import commentRoutes from './module/comment/comment.controller';
import { authValidate } from './helper/jwt';
import imageRoutes from './module/imageUpload/imageUpload.controller';
import userRouters from './module/user/user.controller';

import http from 'http';
import WebSocket from 'ws';
import { swaggerDocsRoute } from './swagger/swagger';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config({
	path: './',
	node_env: process.env.NODE_ENV || 'development',
});

const app = express();

app.use(
	cors({
		origin: ['http://localhost:3001'],
	}),
);
app.use(express.json());
app.use(cookieParser());

app.use(authValidate);

app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRouters);
app.use('/boards', boardRoutes);
app.use('/comments', commentRoutes);
app.use('/images', imageRoutes);
app.use('/docs', swaggerDocsRoute);

const server = http.createServer(app); // http 서버 (3000)

export const wss = new WebSocket.Server({ server }); // websocket 서버 (3000) - 둘 다 돌리기

export interface ExtWebSocket extends WebSocket {
	userEmail?: string;
	userNickname?: string;
}

interface WSMessage {
	type: 'setEmail' | 'setNickname';
	payload: string;
}

wss.on('connection', (ws: ExtWebSocket) => {
	ws.userNickname = 'anonymous user';

	ws.send(`${ws.userNickname} is connected`);

	ws.on('message', (msg) => {
		const message: WSMessage = JSON.parse(msg.toString());

		switch (message.type) {
			case 'setEmail':
				ws.userEmail = message.payload;
				ws.send(`your email is changed : ${message.payload}`);
				break;

			case 'setNickname':
				ws.userNickname = message.payload;
				ws.send(`your nickname is changed : ${message.payload}`);
				break;

			default:
				break;
		}
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log('Server Started');
	console.log(`Port listening on ${process.env.PORT}`);
});
