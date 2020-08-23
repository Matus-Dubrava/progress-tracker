import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import { createProjectItem } from './helpers';
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

it('should return all project items if no query string param is set', async () => {
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryTask,
		projectId
	);

	const response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}/items`)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.length).toEqual(3);
});

it("should not return items that belong to user with different ID than the project owner's ID", async () => {
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserB,
		projectItemConfig.categoryTask,
		projectId
	);

	let response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}/items`)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.length).toEqual(2);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryIssue);
	expect(response.body[1].category).toEqual(projectItemConfig.categoryIssue);

	response = await request(app)
		.get(`${projectConfig.baseProjectUrl}/${projectId}/items`)
		.set('Cookie', cookieUserB)
		.expect(200);

	expect(response.body.length).toEqual(1);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryTask);
});

it('should return all project items that are tasks if query string param type is set to task', async () => {
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryTask,
		projectId
	);

	const response = await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectId}/items?category=${projectItemConfig.categoryTask}`
		)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.length).toEqual(1);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryTask);
});

it('should return all project items that are issues if query string param type is set to issue', async () => {
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryIssue,
		projectId
	);
	await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryTask,
		projectId
	);

	const response = await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectId}/items?category=${projectItemConfig.categoryIssue}`
		)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.length).toEqual(2);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryIssue);
});

it('should return 422 if query string param type is set to something else than task or issue', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectId}/items?category=${projectItemConfig.invalidCategoryType}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 403 if user is not signed in', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectId}/items?category=${projectItemConfig.categoryIssue}`
		)
		.expect(403);
});
