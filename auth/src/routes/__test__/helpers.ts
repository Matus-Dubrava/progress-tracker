import jwt from 'jsonwebtoken';
import { Response } from 'supertest';

export const parseJwtValueFromCookieSession = (session: string) => {
	const buf = Buffer.from(session, 'base64');
	const text = buf.toString('ascii');

	const jwtValue = JSON.parse(text).jwt;
	const val = jwt.decode(jwtValue) as {
		id: string;
		email: string;
		iat: number;
	};
	return val;
};

export const parseCookieSessionFromResponse = (response: Response) => {
	return response.get('Set-Cookie')[0].split(';')[0].split('sess=')[1];
};
