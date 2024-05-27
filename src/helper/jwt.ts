import pkg from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

const { sign, verify } = pkg;

// 토큰 발급
export function generateAccessToken({
	nickname,
	email,
}: {
	email: string;
	nickname: string;
}) {
	const accessToken = sign(
		{
			nickname,
			email,
			exp: Date.now() + 1000 * 60 * 60,
		},
		process.env.JWT_SECRET!,
	);

	return accessToken;
}

export function generateRefreshToken({
	nickname,
	email,
}: {
	email: string;
	nickname: string;
}) {
	const refreshToken = sign(
		{
			nickname,
			email,
			exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
		},
		process.env.JWT_SECRET_REFRESH!,
	);

	return refreshToken;
}

type Decoded = {
	nickname: string;
	email: string;
	exp: number;
};

export function verifyToken(decoded: Decoded): boolean {
	// exp가 현재 시간 이전인 경우(만료된 토큰)
	if (decoded.exp < Date.now()) return false;
	else return true;
}

export function decodeToken(token: string, secret: string) {
	// 임의의 문자열로 구성된 토큰을 Payload로 되돌림
	try {
		const decoded = verify(token, secret) as Decoded;
		return decoded;
	} catch (err) {
		throw new Error('Failed to decode token');
	}
}

export function authValidate(req: Request, res: Response, next: NextFunction) {
	const token = req.headers['authorization']?.split(' ')[1];

	if (token) {
		const decoded = decodeToken(token, process.env.JWT_SECRET!);
		const isOK = verifyToken(decoded);

		if (isOK) {
			req.cookies.email = decoded.email;
			req.cookies.nickname = decoded.nickname;
		} else {
			throw new Error(`token expired`);
		}
	}

	next();
}
