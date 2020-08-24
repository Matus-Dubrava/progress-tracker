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
it('should return project successfully', async () => {
	let response = await createProject(
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.id).toEqual(projectId);
	expect(response.body.name).toEqual(projectConfig.testProjectName1);
	expect(response.body.ownerId).toEqual(userAId);
});

it('should fail with 401 forbidden when no cookie is present', async () => {
	let response = await createProject(
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}`)
		.expect(401);
});

it('should fail with 401 if user requesting a project is not its owner', async () => {
	let response = await createProject(
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserB)
		.expect(401);
});

it('should fail with 422 if ID of the project is not 24 characters long', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectInvalidId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should fail with 404 if project with given id does not exist', async () => {
	await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}`)
		.set('Cookie', cookieUserA)
		.expect(404);
});
