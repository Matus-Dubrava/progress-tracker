import request from 'supertest';

import { app } from '../../../app';
import { config } from './config';
import {
	parseCookieFromResponse,
	parseCookieSessionFromResponse,
} from './helpers';
import { User } from '../../../models/user';

let userId: string;
let cookie: string;

beforeEach(async () => {
	const response = await request(app)
		.post(config.signupPostUrl)
		.send({
			name: config.testName,
			email: config.testEmail,
			password: config.testPassword,
		})
		.expect(201);

	userId = response.body.id;
	cookie = parseCookieFromResponse(response);
});

it('should delete user successfully and return 204', async () => {
	await request(app)
		.delete(`${config.baseAuthUrl}/${userId}`)
		.set('Cookie', cookie)
		.expect(204);

	const user = await User.findById(userId);
	expect(user).toBeNull();
});

it('should invalidate cookie once the user is deleted', async () => {
	const response = await request(app)
		.delete(`${config.baseAuthUrl}/${userId}`)
		.set('Cookie', cookie)
		.expect(204);

	const session = parseCookieSessionFromResponse(response);
	expect(session).toEqual('');
});

it("should return 204 even if the user doesn't exist", async () => {
	await request(app)
		.delete(`${config.baseAuthUrl}/${userId}`)
		.set('Cookie', cookie)
		.expect(204);

	await request(app)
		.delete(`${config.baseAuthUrl}/${userId}`)
		.set('Cookie', cookie)
		.expect(204);
});

it('should fail with 401 if valid cookie is not provided', async () => {
	await request(app).delete(`${config.baseAuthUrl}/${userId}`).expect(401);
});
