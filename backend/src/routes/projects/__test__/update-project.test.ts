import request from 'supertest';
import moment from 'moment';

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

it('should update project description, isFinished status, and dates correctly', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;
	const dateUpdated = response.body.dateUpdated;

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			description: projectConfig.testProjectDescriptionUpdated,
			isFinished: true,
		})
		.expect(200);

	expect(response.body.name).toEqual(projectConfig.testProjectName1);
	expect(response.body.description).toEqual(
		projectConfig.testProjectDescriptionUpdated
	);
	expect(response.body.isFinished).toBeTruthy();
	expect(response.body.dateUpdated).not.toEqual(dateUpdated);
});

it('should correctly set date finished when isFinished attribute is set to true', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;
	const currentDate = moment().format().split('T')[0];

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			isFinished: true,
		})
		.expect(200);

	expect(response.body.isFinished).toBeTruthy();
	expect(response.body.dateFinished.split('T')[0]).toEqual(currentDate);
});

it('should remove dateFinished (set to undefined) if isFinished attribute is changed to false', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			isFinished: true,
		})
		.expect(200);

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			isFinished: false,
		})
		.expect(200);

	expect(response.body.dateFinished).toBeFalsy();
	expect(response.body.isFinished).toBeFalsy();
});

it('should fail with 422 if someone tryies to change name of the project', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			name: projectConfig.testProjectName2,
		})
		.expect(422);
});

it('should be able to update each attribute [description, isFinished] separately, leaving the rest unchanged', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			description: projectConfig.testProjectDescriptionUpdated,
		})
		.expect(200);

	expect(response.body.description).toEqual(
		projectConfig.testProjectDescriptionUpdated
	);
	expect(response.body.isFinished).toBeFalsy();

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			isFinished: true,
		})
		.expect(200);

	expect(response.body.description).toEqual(
		projectConfig.testProjectDescriptionUpdated
	);
	expect(response.body.isFinished).toBeTruthy();
});

it('should fail with 403 forbidden when no cookie is present', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.expect(403);
});

it('should fail with 403 if user updating a project is not its owner', async () => {
	let response = await createProject(
		userAId,
		cookieUserA,
		projectConfig.testProjectName1
	);
	const projectId = response.body.id;

	response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserB)
		.expect(403);
});

it('should fail with 422 if ID of the project is not 24 characters long', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectInvalidId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should fail with 404 if project with given id does not exist', async () => {
	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}`)
		.set('Cookie', cookieUserA)
		.expect(404);
});
