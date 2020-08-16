import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../app';
import { config } from './config';
import { parseJwtValueFromCookieSession } from './helpers';

it('returns 201 on successful signup', async () => {
	return request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			name: config.testName,
			password: config.testPassword,
		})
		.expect(201);
});

it('should return 201 even when the same name is used by more than one user', async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			name: config.testName,
			password: config.testPassword,
		})
		.expect(201);

	// change only email (which needs to be unique)
	await request(app)
		.post(config.signupPostUrl)
		.send({
			email: `test@test.io`,
			name: config.testName,
			password: config.testPassword,
		})
		.expect(201);
});

it('should fail with 422 if any of the required fields is missing [email, name, and password]', async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			name: config.testName,
		})
		.expect(422);

	await request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			password: config.testPassword,
		})
		.expect(422);

	await request(app)
		.post(config.signupPostUrl)
		.send({
			password: config.testPassword,
			name: config.testName,
		})
		.expect(422);
});

it('should fail with 422 if invalid email address is supplied', async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			password: config.testPassword,
			email: config.invalidTestEmail,
		})
		.expect(422);
});

it('should fail with 422 if password with less than 8 characters is used', async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			password: config.invalidTestPassword,
			name: config.testName,
			email: config.testEmail,
		})
		.expect(422);
});

it('should fail with 422 if email address is already in use', async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			password: config.testPassword,
			name: config.testName,
			email: config.testEmail,
		})
		.expect(201);

	await request(app)
		.post(config.signupPostUrl)
		.send({
			password: config.testPassword,
			name: config.testName,
			email: config.testEmail,
		})
		.expect(422);
});

it('should return cookie on successful signup with correct email stored in JWT', async () => {
	const response = await request(app)
		.post(config.signupPostUrl)
		.send({
			password: config.testPassword,
			name: config.testName,
			email: config.testEmail,
		})
		.expect(201);

	const session = response
		.get('Set-Cookie')[0]
		.split(';')[0]
		.split('session=')[1];

	const jwtValue = parseJwtValueFromCookieSession(session);

	// const buf = Buffer.from(session, 'base64');
	// const text = buf.toString('ascii');

	// const jwtValue = JSON.parse(text).jwt;
	// const val = jwt.decode(jwtValue) as {
	// 	id: string;
	// 	email: string;
	// 	iat: number;
	// };

	expect(jwtValue.email).toEqual(config.testEmail);
	expect(jwtValue.id).not.toBeNull();
});
