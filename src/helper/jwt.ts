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
	const decoded = verify(token, secret) as Decoded;
	return decoded;
}

export function authValidate(req: Request, res: Response, next: NextFunction) {
	const decodedByAccessToken = decodeToken(
		req.cookies['accessToken'],
		process.env.JWT_SECRET!,
	);

	const decodedByRefreshToken = decodeToken(
		req.cookies['refreshToken'],
		process.env.JWT_SECRET_REFRESH!,
	);

	const isAccessTokenOK = verifyToken(decodedByAccessToken);
	const isRefreshTokenOK = verifyToken(decodedByRefreshToken);

	// 엑세스 토큰 혹은 리프레시 토큰이 둘 중에 하나라도 유효해야함
	// 만약 둘 다 유효하지 않다면 ㅈ되는 거야

	if (isAccessTokenOK || isRefreshTokenOK) {
		req.cookies.email = decodedByRefreshToken.email;
		req.cookies.nickname = decodedByRefreshToken.nickname;
	} else {
	}

	// 엑세스 토큰이 만료 여부와 별개로 존재하는지 확인
	// // 엑세스 토큰이 만료되었다면 email이 undef일 것임
	// if (isOk) {
	// 	// 따라서 엑세스 토큰이 만료되지 않았다면 req에 심어주기
	// 	req.cookies.email = decoded.email;
	// 	req.cookies.nickname = decoded.nickname;
	// } else {
	// 	// 엑세스토큰이 만료되었다면 리프레시 토큰은 상황이 어떤지 확인해보기
	// 	const { email, nickname } = decodeToken(
	// 		accessToken,
	// 		process.env.JWT_SECRET_Refresh!,
	// 	);
	// 	// 리프레시 토큰은 살아있다면 일단 req에 하던 거 마저 심고
	// 	if (email) {
	// 		req.cookies.email = decoded.email;
	// 		req.cookies.nickname = decoded.nickname;
	// 		// 새로 엑세스 토큰과 리프레시 토큰 넣어드립시다
	// 		const accessToken = generateAccessToken({ email, nickname });
	// 		const refreshToken = generateRefreshToken({ email, nickname });
	// 		res
	// 			.cookie('accessToken', accessToken, {
	// 				maxAge: 1000 * 60 * 60,
	// 				httpOnly: true,
	// 			})
	// 			.cookie('refreshToken', refreshToken, {
	// 				maxAge: 1000 * 60 * 60 * 60,
	// 				httpOnly: true,
	// 			});
	// 	}
	// }
	// }

	next();
}
