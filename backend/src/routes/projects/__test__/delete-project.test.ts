import request from 'supertest';

import { app } from '../../../app';
import { config as projectConfig } from './config';
import { config as userConfig } from '../../auth/__test__/config';
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

it('should delete project successfully and return 204', async () => {
	const response = await createProject(
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	await request(app)
		.delete(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.expect(204);

	await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.expect(404);
});

it('should return 403 if valid cookie is not present', async () => {
	const response = await createProject(
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	await request(app)
		.delete(`${projectConfig.baseProjectUrl}/${projectId}`)
		.expect(403);
});

it("should return 404 if specified project doesn't exist", async () => {
	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}`
		)
		.set('Cookie', cookieUserA)
		.expect(404);
});

it('should return 403 if user tries to delete project that it is not the owner of', async () => {
	const response = await createProject(
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	await request(app)
		.delete(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserB)
		.expect(403);
});

it('should fail with 422 if ID of the project is not 24 characters long', async () => {
	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectInvalidId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});
