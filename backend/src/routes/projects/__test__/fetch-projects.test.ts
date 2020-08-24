import request from 'supertest';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from './config';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';
import { createProject } from './helpers';

let cookieUserA: string;
let cookieUserB: string;

beforeEach(async () => {
	let response = await request(app)
		.post(userConfig.signupPostUrl)
		.send({
			name: userConfig.testName,
			email: userConfig.testEmail,
			password: userConfig.testPassword,
		})
		.expect(201);

	cookieUserA = parseCookieFromResponse(response);

	response = await request(app)
		.post(userConfig.signupPostUrl)
		.send({
			name: userConfig.testName,
			email: userConfig.testEmail2,
			password: userConfig.testPassword,
		})
		.expect(201);

	cookieUserB = parseCookieFromResponse(response);
});

it('should return all projects that belong to the user that is requesting them', async () => {
	await createProject(cookieUserA, projectConfig.testProjectName1);
	await createProject(cookieUserA, projectConfig.testProjectName2);
	await createProject(cookieUserB, projectConfig.testProjectName3);

	// test user A
	let response = await request(app)
		.get(projectConfig.baseProjectUrl)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.length).toEqual(2);
	expect(response.body[0].name).toEqual(projectConfig.testProjectName2);
	expect(response.body[1].name).toEqual(projectConfig.testProjectName1);

	// test user B
	response = await request(app)
		.get(projectConfig.baseProjectUrl)
		.set('Cookie', cookieUserB)
		.expect(200);

	expect(response.body.length).toEqual(1);
	expect(response.body[0].name).toEqual(projectConfig.testProjectName3);
});

it('should return 401 forbidden if user is not signed in', async () => {
	await request(app).get(projectConfig.baseProjectUrl).expect(401);
});

it('should return empty list if user does not have any projects', async () => {
	await createProject(cookieUserA, projectConfig.testProjectName1);

	const response = await request(app)
		.get(projectConfig.baseProjectUrl)
		.set('Cookie', cookieUserB)
		.expect(200);

	expect(response.body.length).toEqual(0);
});
