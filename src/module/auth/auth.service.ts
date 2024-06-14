import { assert } from 'superstruct';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { RefreshToken, SignIn, SignUp } from './auth.structs';
import pkg from 'bcryptjs';
import * as dotenv from 'dotenv';
import {
	decodeToken,
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
} from '../../helper/jwt';

dotenv.config();

const { genSalt, hash, compare } = pkg;

const prisma = new PrismaClient();

export async function signUp(req: Request, res: Response) {
	// 제대로 들어왔나 확인
	assert(req.body, SignUp);

	// 구조 분해
	const { email, password, nickname } = req.body;

	// salt + hash
	const salt = await genSalt();
	const hashedPassword = await hash(password, salt);

	await prisma.user.create({
		data: { email, password: hashedPassword, nickname },
	});

	const accessToken = generateAccessToken({ email, nickname });
	const refreshToken = generateRefreshToken({ email, nickname });

	res.status(201).send({ accessToken, refreshToken });
}

export async function signIn(req: Request, res: Response) {
	assert(req.body, SignIn);

	// check
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({ where: { email } });

	if (user && (await compare(password, user.password))) {
		const accessToken = generateAccessToken({ email, nickname: user.nickname });
		const refreshToken = generateRefreshToken({
			email,
			nickname: user.nickname,
		});
		res.status(200).send({ accessToken, refreshToken });
	} else {
		res.sendStatus(401);
	}
}

export async function refreshToken(req: Request, res: Response) {
	assert(req.body, RefreshToken);

	const oldRefreshToken = req.body.refreshToken;

	const decoded = decodeToken(oldRefreshToken, process.env.JWT_SECRET_REFRESH!);
	const isOk = verifyToken(decoded);

	if (isOk) {
		const accessToken = generateAccessToken({
			email: decoded.email,
			nickname: decoded.nickname,
		});

		res.status(200).send({ accessToken });
	} else {
		res.status(400).send({ message: '리프레시 토큰이 만료되었습니다 ' });
	}
}

export async function signOut(req: Request, res: Response) {
	const email = req.cookies.email;
	const user = await prisma.user.findUnique({ where: { email } });

	if (user) {
		res
			.status(201)
			.cookie('accessToken', '', { maxAge: 0, httpOnly: true })
			.cookie('refreshToken', '', { maxAge: 0, httpOnly: true })
			.send('로그아웃');
	} else {
		res.sendStatus(401);
	}
}
