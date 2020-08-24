import request from 'supertest';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import {
	createProjectItem,
	createProjectItemComment,
	deleteProjectItemComment,
	fetchProjectItem,
} from './helpers';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

let cookieUserA: string;
let cookieUserB: string;
let projectIdUserA: string;
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

it('should delete comment successfully and return 204', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	const comment1Id = response.body.comments[0].id;

	response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText2,
		expect: 200,
	});

	const comment2Id = response.body.comments[1].id;

	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: comment1Id,
		expect: 204,
	});

	response = await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 200,
	});

	expect(response.body.comments.length).toEqual(1);
	expect(response.body.comments[0].text).toEqual(
		projectItemConfig.commentText2
	);

	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: comment2Id,
		expect: 204,
	});

	response = await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 200,
	});

	expect(response.body.comments.length).toEqual(0);
});

it('should return 422 if comment item with given ID does not exist', async () => {
	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: projectConfig.testProjectId,
		expect: 422,
	});
});

it('should return 422 if comment ID is not in a valid mongodb format', async () => {
	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId: projectConfig.testProjectInvalidId,
		expect: 422,
	});
});

it('should return 422 if project item with given ID does not exist', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectId,
		commentId,
		expect: 422,
	});
});

it('should return 422 if project item ID is not in a valid mongodb format', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectInvalidId,
		commentId,
		expect: 422,
	});
});

it('should return 422 if project with given ID does not exist', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		itemId: projectItemIdUserA,
		commentId,
		expect: 422,
	});
});

it('should return 422 if project ID is not in valid mongodb format', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	await deleteProjectItemComment({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		itemId: projectItemIdUserA,
		commentId,
		expect: 422,
	});
});

it('should return 401 if user is not signed in', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	await deleteProjectItemComment({
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		expect: 401,
	});
});

it('should return 401 if user is not the owner of the project', async () => {
	let response = await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});
	const commentId = response.body.comments[0].id;

	await deleteProjectItemComment({
		cookie: cookieUserB,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		commentId,
		expect: 401,
	});
});
