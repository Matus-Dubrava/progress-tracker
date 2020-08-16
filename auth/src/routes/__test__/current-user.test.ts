import request from 'supertest';

import { app } from '../../app';
import { config } from './config';

it('should return current user set to null if the user is not signed in', async () => {
	const response = await request(app)
		.get(config.currentUserGetUrl)
		.expect(200);

	expect(response.body.currentUser).toBeNull();
});

it('should correctly return current user when the user is signed in', async () => {
	let response = await request(app).post(config.signupPostUrl).send({
		email: config.testEmail,
		name: config.testName,
		password: config.testPassword,
	});

	// parse cookie from response header
	const cookie = response
		.get('Set-Cookie')
		.map((cookieString) => cookieString.split(';')[0])
		.join('; ');

	response = await request(app)
		.get(config.currentUserGetUrl)
		.set('Cookie', cookie)
		.expect(200);

	expect(response.body.currentUser.email).toEqual(config.testEmail);
	expect(response.body.currentUser.id).not.toBeNull();
});
