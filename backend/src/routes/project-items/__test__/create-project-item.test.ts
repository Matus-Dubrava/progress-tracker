import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

let userAId: string;
let userBId: string;
let cookieUserA: string;
let cookieUserB: string;
let projectId: string;

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

	response = await createProject(cookieUserA, projectConfig.testProjectName1);
	projectId = response.body.id;
});

it('should create project successfully and return 201', async () => {
	const response = await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			title: projectItemConfig.testTitle,
			category: projectItemConfig.categoryTask,
			description: projectItemConfig.testDescription,
		})
		.expect(201);

	const currentDate = moment().format().split('T')[0];

	expect(response.body.title).toEqual(projectItemConfig.testTitle);
	expect(response.body.category).toEqual(projectItemConfig.categoryTask);
	expect(response.body.description).toEqual(
		projectItemConfig.testDescription
	);
	expect(response.body.dateCreated.split('T')[0]).toEqual(currentDate);
	expect(response.body.dateUpdated.split('T')[0]).toEqual(currentDate);
	expect(response.body.dateFinished).toBeFalsy();
	expect(response.body.projectId).toEqual(projectId);
	expect(response.body.id).not.toBeNull();
});

it('should return 422 if any of the required attributes are missing [title, description, category]', async () => {
	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			category: projectItemConfig.categoryTask,
			description: projectItemConfig.testDescription,
		})
		.expect(422);

	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			title: projectItemConfig.testTitle,
			description: projectItemConfig.testDescription,
		})
		.expect(422);

	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			title: projectItemConfig.testTitle,
			category: projectItemConfig.categoryTask,
		})
		.expect(422);
});

it('should return 422 if project with the specified ID does not exist', async () => {
	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}`)
		.set('Cookie', cookieUserA)
		.send({
			title: projectItemConfig.testTitle,
			category: projectItemConfig.categoryTask,
			description: projectItemConfig.testDescription,
		})
		.expect(422);
});

it('should return 403 if user is not signed in', async () => {
	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.send({
			title: projectItemConfig.testTitle,
			category: projectItemConfig.categoryTask,
			description: projectItemConfig.testDescription,
		})
		.expect(403);
});

it("should return 403 if signed in user's ID doesn't match the project owner's ID", async () => {
	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserB)
		.send({
			title: projectItemConfig.testTitle,
			category: projectItemConfig.categoryTask,
			description: projectItemConfig.testDescription,
		})
		.expect(403);
});

it('should return 422 if category is not one of the allowed values [task, issue]', async () => {
	await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}`)
		.set('Cookie', cookieUserA)
		.send({
			title: projectItemConfig.testTitle,
			category: 'some',
			description: projectItemConfig.testDescription,
		})
		.expect(403);
});
