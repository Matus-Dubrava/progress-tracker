import request from 'supertest';

import { app } from '../../app';

const API_VERSION = process.env.API_VERSION;
const signoutUrl = `/api/${API_VERSION}/auth/signout`;
const signupPostUrl = `/api/${API_VERSION}/auth/signup`;

const testEmail = 'test@test.com';
const testPassword = 'testpassword12345';
const testName = 'testname';

it('should return 200 if the user is not signed in', async () => {
	await request(app).get(signoutUrl).expect(200);
});

it('should remove cookie if the user is signed in', async () => {
	await request(app)
		.post(signupPostUrl)
		.send({
			email: testEmail,
			name: testName,
			password: testPassword,
		})
		.expect(201);

	const response = await request(app).get(signoutUrl).expect(200);

	const session = response
		.get('Set-Cookie')[0]
		.split(';')[0]
		.split('session=')[1];

	expect(session).toEqual('');
});
