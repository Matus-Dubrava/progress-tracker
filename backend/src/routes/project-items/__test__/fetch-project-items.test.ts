import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import { createProjectItem, fetchProjectItems } from './helpers';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

let cookieUserA: string;
let cookieUserB: string;
let projectIdUserA: string;
let projectIdUserB: string;

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
	projectIdUserA = response.body.id;

	response = await createProject(cookieUserB, projectConfig.testProjectName2);
	projectIdUserB = response.body.id;
});

it('should return all project items if no query string param is set', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});

	const response = await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		expect: 200,
	});

	expect(response.body.length).toEqual(3);
});

it('should return properly serialized project items', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});

	const response = await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		expect: 200,
	});

	const currentDate = moment().format().split('T')[0];

	expect(response.body[0].title).toEqual(projectItemConfig.testTitle);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryTask);
	expect(response.body[0].description).toEqual(
		projectItemConfig.testDescription
	);
	expect(response.body[0].dateCreated.split('T')[0]).toEqual(currentDate);
	expect(response.body[0].dateUpdated.split('T')[0]).toEqual(currentDate);
	expect(response.body[0].dateFinished).toBeFalsy();
	expect(response.body[0].projectId).toEqual(projectIdUserA);
	expect(response.body[0].id).toBeDefined();
	expect(response.body[0].comments.length).toEqual(0);

	expect(response.body._id).toBeUndefined();
	expect(response.body.__v).toBeUndefined();
});

it("should not return items that belong to user with different ID than the project owner's ID", async () => {
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserB,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserB,
		expect: 201,
	});

	let response = await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		expect: 200,
	});

	expect(response.body.length).toEqual(2);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryIssue);
	expect(response.body[1].category).toEqual(projectItemConfig.categoryIssue);

	response = await fetchProjectItems({
		cookie: cookieUserB,
		projectId: projectIdUserB,
		expect: 200,
	});

	expect(response.body.length).toEqual(1);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryTask);
});

it('should return all project items that are tasks if query string param type is set to task', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});

	const response = await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		category: projectItemConfig.categoryTask,
		expect: 200,
	});

	expect(response.body.length).toEqual(1);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryTask);
});

it('should return all project items that are issues if query string param type is set to issue', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryIssue,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});

	const response = await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		category: projectItemConfig.categoryIssue,
		expect: 200,
	});

	expect(response.body.length).toEqual(2);
	expect(response.body[0].category).toEqual(projectItemConfig.categoryIssue);
});

it('should return 422 if query string param type is set to something else than task or issue', async () => {
	await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		category: projectItemConfig.invalidCategoryType,
		expect: 422,
	});
});

it('should return 401 if user is not signed in', async () => {
	await fetchProjectItems({
		projectId: projectIdUserA,
		category: projectItemConfig.categoryIssue,
		expect: 401,
	});
});

it('should return 404 if project with specified ID does not exist', async () => {
	await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		category: projectItemConfig.categoryIssue,
		expect: 404,
	});
});

it('should return 422 if project ID is not in the valid mongodb ID format', async () => {
	await fetchProjectItems({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		category: projectItemConfig.categoryIssue,
		expect: 422,
	});
});
