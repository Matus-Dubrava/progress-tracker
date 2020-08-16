import jwt from 'jsonwebtoken';

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
