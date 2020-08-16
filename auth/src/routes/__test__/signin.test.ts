import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../app';
import { config } from './config';

beforeEach(async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			name: config.testName,
			password: config.testPassword,
		})
		.expect(201);
});

it('should return 200 on successfull signup', async () => {
	await request(app)
		.post(config.signinPostUrl)
		.send({
			email: config.testEmail,
			password: config.testPassword,
		})
		.expect(200);
});

it('should return cookie on successful signup with correct email stored in JWT', async () => {
	const response = await request(app)
		.post(config.signinPostUrl)
		.send({
			email: config.testEmail,
			password: config.testPassword,
		})
		.expect(200);

	const session = response
		.get('Set-Cookie')[0]
		.split(';')[0]
		.split('session=')[1];

	const buf = Buffer.from(session, 'base64');
	const text = buf.toString('ascii');

	const jwtValue = JSON.parse(text).jwt;
	const val = jwt.decode(jwtValue) as {
		id: string;
		email: string;
		iat: number;
	};

	expect(val.email).toEqual(config.testEmail);
	expect(val.id).not.toBeNull();
});

it('should return 422 when incorrect email, password or both are supplied', async () => {
	await request(app)
		.post(config.signinPostUrl)
		.send({
			email: config.testEmail,
			password: '12345',
		})
		.expect(422);

	await request(app)
		.post(config.signinPostUrl)
		.send({
			email: config.invalidTestEmail,
			password: config.testPassword,
		})
		.expect(422);

	await request(app)
		.post(config.signinPostUrl)
		.send({
			email: config.invalidTestEmail,
			password: config.invalidTestPassword,
		})
		.expect(422);
});

it('should return 422 when email or password or both are missing', async () => {
	await request(app)
		.post(config.signinPostUrl)
		.send({
			email: config.testEmail,
		})
		.expect(422);

	await request(app)
		.post(config.signinPostUrl)
		.send({
			password: config.testPassword,
		})
		.expect(422);

	await request(app).post(config.signinPostUrl).send({}).expect(422);
});
