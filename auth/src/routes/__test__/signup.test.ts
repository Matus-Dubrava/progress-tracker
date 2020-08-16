import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../../app';

const API_VERSION = process.env.API_VERSION;
const signupPostUrl = `/api/${API_VERSION}/auth/signup`;

const testEmail = 'test@test.com';
const invalidTestEmail = 'test.com';
const testPassword = 'testpassword12345';
const invalidTestPassword = '12345'; // too short, required at least 8 characters
const testName = 'testname';

it('returns 201 on successful signup', async () => {
	return request(app)
		.post(signupPostUrl)
		.send({
			email: testEmail,
			name: testName,
			password: testPassword,
		})
		.expect(201);
});

it('should return 201 even when the same name is used by more than one user', async () => {
	await request(app)
		.post(signupPostUrl)
		.send({
			email: testEmail,
			name: testName,
			password: testPassword,
		})
		.expect(201);

	// change only email (which needs to be unique)
	await request(app)
		.post(signupPostUrl)
		.send({
			email: `test@test.io`,
			name: testName,
			password: testPassword,
		})
		.expect(201);
});

it('should fail with 422 if any of the required fields is missing [email, name, and password]', async () => {
	await request(app)
		.post(signupPostUrl)
		.send({
			email: testEmail,
			name: testName,
		})
		.expect(422);

	await request(app)
		.post(signupPostUrl)
		.send({
			email: testEmail,
			password: testPassword,
		})
		.expect(422);

	await request(app)
		.post(signupPostUrl)
		.send({
			password: testPassword,
			name: testName,
		})
		.expect(422);
});

it('should fail with 422 if invalid email address is supplied', async () => {
	await request(app)
		.post(signupPostUrl)
		.send({
			password: testPassword,
			email: invalidTestEmail,
		})
		.expect(422);
});

it('should fail with 422 if password with less than 8 characters is used', async () => {
	await request(app)
		.post(signupPostUrl)
		.send({
			password: invalidTestPassword,
			name: testName,
			email: testEmail,
		})
		.expect(422);
});

it('should fail with 422 if email address is already in use', async () => {
	await request(app)
		.post(signupPostUrl)
		.send({
			password: testPassword,
			name: testName,
			email: testEmail,
		})
		.expect(201);

	await request(app)
		.post(signupPostUrl)
		.send({
			password: testPassword,
			name: testName,
			email: testEmail,
		})
		.expect(422);
});

it('should return cookie on successful signup with correct email stored in JWT', async () => {
	const response = await request(app)
		.post(signupPostUrl)
		.send({
			password: testPassword,
			name: testName,
			email: testEmail,
		})
		.expect(201);

	const session = response
		.get('Set-Cookie')[0]
		.split(';')[0]
		.split('session=')[1];

	const buf = new Buffer(session, 'base64');
	const text = buf.toString('ascii');

	const jwtValue = JSON.parse(text).jwt;
	const val = jwt.decode(jwtValue) as {
		id: string;
		email: string;
		iat: number;
	};

	expect(val.email).toEqual(testEmail);
	expect(val.id).not.toBeNull();
});
