import request from 'supertest';

import { app } from '../../../app';
import { config } from './config';
import { parseCookieFromResponse } from './helpers';

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

	const cookie = parseCookieFromResponse(response);

	response = await request(app)
		.get(config.currentUserGetUrl)
		.set('Cookie', cookie)
		.expect(200);

	expect(response.body.currentUser.email).toEqual(config.testEmail);
	expect(response.body.currentUser.id).not.toBeNull();
});

it('should return currentuser with name, email, and password', async () => {
	let response = await request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			name: config.testName,
			password: config.testPassword,
		})
		.expect(201);

	const cookie = parseCookieFromResponse(response);

	response = await request(app)
		.get(config.currentUserGetUrl)
		.set('Cookie', cookie)
		.expect(200);

	const { currentUser } = response.body;

	expect(currentUser).not.toBeNull();
	expect(currentUser.id).not.toBeNull();
	expect(currentUser.email).toEqual(config.testEmail);
	expect(currentUser.name).toEqual(config.testName);
});
