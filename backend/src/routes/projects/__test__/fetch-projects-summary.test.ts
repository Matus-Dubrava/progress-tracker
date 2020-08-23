import request from 'supertest';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from './config';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';
import { createProject } from './helpers';

let userAId: string;
let userBId: string;
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

	userAId = response.body.id;
	cookieUserA = parseCookieFromResponse(response);

	response = await request(app)
		.post(userConfig.signupPostUrl)
		.send({
			name: userConfig.testName,
			email: userConfig.testEmail2,
			password: userConfig.testPassword,
		})
		.expect(201);

	userBId = response.body.id;
	cookieUserB = parseCookieFromResponse(response);
});

it('should return correct number of total, active and closed projects that belong to a logged in user', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	await createProject(userAId, cookieUserA, projectConfig.testProjectName2);
	await createProject(userBId, cookieUserB, projectConfig.testProjectName3);

	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${response.body.id}`)
		.set('Cookie', cookieUserA)
		.send({
			isFinished: true,
		})
		.expect(200);

	response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/summary`)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.totalProjectsCount).toEqual(2);
	expect(response.body.activeProjectsCount).toEqual(1);
	expect(response.body.finishedProjectsCount).toEqual(1);

	response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/summary`)
		.set('Cookie', cookieUserB)
		.expect(200);

	expect(response.body.totalProjectsCount).toEqual(1);
	expect(response.body.activeProjectsCount).toEqual(1);
	expect(response.body.finishedProjectsCount).toEqual(0);
});

it('should return 403 if user is not signed in', async () => {
	await request(app)
		.get(`${projectConfig.baseProjectUrl}/summary`)
		.expect(403);
});
