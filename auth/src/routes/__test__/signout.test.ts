import request from 'supertest';

import { app } from '../../app';
import { config } from './config';

it('should return 200 if the user is not signed in', async () => {
	await request(app).get(config.signoutGetUrl).expect(200);
});

it('should remove cookie if the user is signed in', async () => {
	await request(app)
		.post(config.signupPostUrl)
		.send({
			email: config.testEmail,
			name: config.testName,
			password: config.testPassword,
		})
		.expect(201);

	const response = await request(app).get(config.signoutGetUrl).expect(200);

	const session = response
		.get('Set-Cookie')[0]
		.split(';')[0]
		.split('session=')[1];

	expect(session).toEqual('');
});
