import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject, updateProject } from '../../projects/__test__/helpers';
import { createProjectItem } from './helpers';
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

it('should create project item successfully and return 201, item should be properly serialized', async () => {
	const response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		description: projectItemConfig.testDescription,
		expect: 201,
	});

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
	expect(response.body.id).toBeDefined();
	expect(response.body.comments.length).toEqual(0);

	expect(response.body._id).toBeUndefined();
	expect(response.body.__v).toBeUndefined();
});

it('should return 422 if any of the required attributes are missing [title, description, category]', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		projectId,
		category: projectItemConfig.categoryTask,
		description: projectItemConfig.testDescription,
		expect: 422,
	});

	await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		expect: 422,
	});

	await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		expect: 422,
	});
});

it('should return 422 if project with the specified ID does not exist', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		description: projectItemConfig.testDescription,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		expect: 422,
	});
});

it('should return 422 if project ID is not in the valid mongodb ID format', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		description: projectItemConfig.testDescription,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		expect: 422,
	});
});

it('should return 401 if user is not signed in', async () => {
	await createProjectItem({
		projectId,
		description: projectItemConfig.testDescription,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		expect: 401,
	});
});

it("should return 401 if signed in user's ID doesn't match the project owner's ID", async () => {
	await createProjectItem({
		cookie: cookieUserB,
		projectId,
		description: projectItemConfig.testDescription,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		expect: 401,
	});
});

it('should return 422 if category is not one of the allowed values [task, issue]', async () => {
	await createProjectItem({
		cookie: cookieUserA,
		projectId,
		description: projectItemConfig.testDescription,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.invalidCategoryType,
		expect: 422,
	});
});

it('should return 403 if project is closed', async () => {
	await updateProject({
		cookie: cookieUserA,
		projectId,
		isFinished: true,
		expect: 200,
	});

	await createProjectItem({
		cookie: cookieUserA,
		projectId,
		description: projectItemConfig.testDescription,
		title: projectItemConfig.testTitle,
		category: projectItemConfig.categoryTask,
		expect: 403,
	});
});
