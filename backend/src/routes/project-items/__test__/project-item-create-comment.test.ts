import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import { createProjectItem, createProjectItemComment } from './helpers';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

let cookieUserA: string;
let cookieUserB: string;
let projectIdUserA: string;
let projectIdUserB: string;
let projectItemIdUserA: string;

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

	response = await createProjectItem({
		cookie: cookieUserA,
		category: projectItemConfig.categoryTask,
		title: projectItemConfig.testTitle,
		description: projectItemConfig.testDescription,
		projectId: projectIdUserA,
		expect: 201,
	});
	projectItemIdUserA = response.body.id;
});

it('should successfully create comment and return project item containing properly serialized comment', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	expect(response.body.comments.length).toEqual(1);
	expect(response.body.comments[0].text).toEqual(
		projectItemConfig.commentText1
	);
	expect(response.body.comments[0].dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
	expect(response.body.comments[0].id).toBeDefined();
	expect(response.body.comments[0]._id).toBeUndefined();
	expect(response.body.comments[0].__v).toBeUndefined();
});

it('should return 422 if required attribute [text] is not specified', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 422,
	});
});

it('should return 422 if required attribute [text] is not at least 15 characters long', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.invalidCommentText,
		expect: 422,
	});
});

it('should return 422 if project with specified ID does not exist', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 422,
	});
});

it('should return 422 if project ID is not in the valid mongodb ID format', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 422,
	});
});

it('should return 422 if project item with specified ID does not exist', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectId,
		text: projectItemConfig.commentText1,
		expect: 422,
	});
});

it('should return 422 if project item ID is not in the valid mongodb ID format', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectInvalidId,
		text: projectItemConfig.commentText1,
		expect: 422,
	});
});

it('should return 403 if user is not the owner of the project', async () => {
	await createProjectItemComment({
		cookie: cookieUserB,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 403,
	});
});

it('should return 403 if user is not signed in', async () => {
	await createProjectItemComment({
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 403,
	});
});
