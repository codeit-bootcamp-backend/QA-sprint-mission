import { assert } from 'superstruct';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateComment } from '../comment.struct';
import { ExtWebSocket, wss } from '../../../app';

const prisma = new PrismaClient();

export async function Comment_create_onProduct(req: Request, res: Response) {
	assert(req.body, CreateComment);
	const { id: productId } = req.params;
	const { ...commentField } = req.body;

	const comment = await prisma.comment.create({
		data: {
			...commentField,
			writerId: { connect: { email: req.cookies.email } },
			productId: { connect: { id: productId } },
		},
	});

	res.send(comment);
}

export async function Comment_create_onBoard(req: Request, res: Response) {
	assert(req.body, CreateComment);
	const { id: BoardId } = req.params;
	const { ...commentField } = req.body;
	const { nickname } = req.cookies;

	const comment = await prisma.comment.create({
		data: {
			...commentField,
			writerId: { connect: { email: req.cookies.email } },
			boardId: { connect: { id: BoardId } },
		},
	});

	// 댓글이 생성되었다면
	if (comment) {
		// 일단 댓글 달린 게시글 찾아서 주인 누군지 확인해야함
		const board = await prisma.board.findUnique({
			where: { id: BoardId },
			select: {
				writer: {
					select: {
						email: true,
					},
				},
			},
		});

		// 댓글이 달린 게시글의 주인에게 알림 보내기
		wss.clients.forEach((client: ExtWebSocket) => {
			if (client.userEmail === board?.writer.email) {
				client.send(
					JSON.stringify({
						type: 'newComment',
						payload: `${nickname}님이 댓글을 달았습니다.`,
					}),
				);
			}
		});
	}

	res.send(comment);
}
