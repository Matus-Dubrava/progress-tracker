import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import {
	createProjectItem,
	deleteProjectItem,
	fetchProjectItem,
} from './helpers';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

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

	response = await createProject(cookieUserA, projectConfig.testProjectName1);
	projectId = response.body.id;
});

it('should delete project item successfully and return 204', async () => {
	const response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectConfig.testProjectDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await deleteProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		expect: 204,
	});

	await fetchProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		expect: 422,
	});
});

it('should return 422 if project item ID is not in the valid mongodb ID format', async () => {
	await deleteProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId: projectConfig.testProjectInvalidId,
		expect: 422,
	});
});

it('should return 422 if project item with given ID does not exist', async () => {
	await deleteProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId: projectConfig.testProjectId,
		expect: 422,
	});
});

it('should return 422 if project ID is not in the valid mongodb ID format', async () => {
	const response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectConfig.testProjectDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await deleteProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		itemId,
		expect: 422,
	});
});

it('should return 422 if project with given ID does not exist', async () => {
	const response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectConfig.testProjectDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await deleteProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		itemId,
		expect: 422,
	});
});

it('should return 401 if user is not signed in', async () => {
	const response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectConfig.testProjectDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await deleteProjectItem({
		projectId,
		itemId,
		expect: 401,
	});
});

it('should return 401 if user is not the owner of the project', async () => {
	const response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectConfig.testProjectDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await deleteProjectItem({
		cookie: cookieUserB,
		projectId,
		itemId,
		expect: 401,
	});
});

// TODO:
// - project closed
// - handle update time of project and project item
