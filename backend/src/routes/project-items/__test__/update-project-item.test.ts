import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import { createProjectItem, updateProjectItem } from './helpers';
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

it('should update project successfully, and return properly serialized object with status code of 200', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	response = await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		title: projectItemConfig.testTitle2,
		description: projectItemConfig.testDescription2,
		isFinished: true,
		category: projectItemConfig.categoryTask,
		expect: 200,
	});

	expect(response.body.title).toEqual(projectItemConfig.testTitle2);
	expect(response.body.description).toEqual(
		projectItemConfig.testDescription2
	);
	expect(response.body.isFinished).toBeTruthy();
	expect(response.body.category).toEqual(projectItemConfig.categoryTask);
	expect(response.body.dateFinished.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
});

it('should be able to update title, leaving rest of the attribute unchanged, except for dateUpdated', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	response = await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		title: projectItemConfig.testTitle2,
		expect: 200,
	});

	expect(response.body.title).toEqual(projectItemConfig.testTitle2);
	expect(response.body.description).toEqual(
		projectItemConfig.testDescription
	);
	expect(response.body.isFinished).toBeFalsy();
	expect(response.body.category).toEqual(projectItemConfig.categoryIssue);
	expect(response.body.dateFinished).toBeUndefined();
});

it('should be able to update description, leaving rest of the attribute unchanged, except for dateUpdated', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	response = await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		description: projectItemConfig.testDescription2,
		expect: 200,
	});

	expect(response.body.title).toEqual(projectItemConfig.testTitle);
	expect(response.body.description).toEqual(
		projectItemConfig.testDescription2
	);
	expect(response.body.isFinished).toBeFalsy();
	expect(response.body.category).toEqual(projectItemConfig.categoryIssue);
	expect(response.body.dateFinished).toBeUndefined();
});

it('should be able to update isFinished, leaving rest of the attribute unchanged, except for dateUpdated and timeFinished', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	response = await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		isFinished: true,
		expect: 200,
	});

	expect(response.body.title).toEqual(projectItemConfig.testTitle);
	expect(response.body.description).toEqual(
		projectItemConfig.testDescription
	);
	expect(response.body.isFinished).toBeFalsy();
	expect(response.body.category).toEqual(projectItemConfig.categoryIssue);
	expect(response.body.dateFinished.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
});

it('should set dateFinished to undefined if isFinished is set to false', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		isFinished: true,
		expect: 200,
	});

	response = await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		isFinished: false,
		expect: 200,
	});

	expect(response.body.dateFinished).toBeUndefined();
});

it('should return 422 if category value is not valid [task, issue]', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId,
		category: projectItemConfig.invalidCategoryType,
		expect: 422,
	});
});

it('should return 422 if project with given ID does not exist', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		itemId,
		isFinished: true,
		expect: 422,
	});
});

it('should return 422 if project ID is not in valid mongodb ID format', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		itemId,
		isFinished: true,
		expect: 422,
	});
});

it('should return 422 if project item with given ID does not exist', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId: projectConfig.testProjectId,
		isFinished: true,
		expect: 422,
	});
});

it('should return 422 if project item ID is not valid mongodb ID format', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserA,
		projectId,
		itemId: projectConfig.testProjectInvalidId,
		isFinished: true,
		expect: 422,
	});
});

it('should return 401 if user is not signed in', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		projectId,
		itemId,
		isFinished: true,
		expect: 422,
	});
});

it('should return 401 if user is not the owner of the project', async () => {
	let response = await createProjectItem({
		cookie: cookieUserA,
		projectId,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		category: projectItemConfig.categoryIssue,
		expect: 201,
	});

	const itemId = response.body.id;

	await updateProjectItem({
		cookie: cookieUserB,
		projectId,
		itemId,
		isFinished: true,
		expect: 422,
	});
});
