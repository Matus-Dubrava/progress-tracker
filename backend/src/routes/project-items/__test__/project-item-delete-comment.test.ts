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
let projectIdUserA: string;
let projectIdUserB: string;
let projectItemIdUserA: string;
let projectItemIdUserB: string;

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
	projectIdUserA = response.body.id;

	response = await createProject(cookieUserB, projectConfig.testProjectName2);
	projectIdUserB = response.body.id;

	response = await createProjectItem(
		cookieUserA,
		projectItemConfig.categoryTask,
		projectIdUserA
	);
	projectItemIdUserA = response.body.id;

	response = await createProjectItem(
		cookieUserB,
		projectItemConfig.categoryTask,
		projectIdUserB
	);
	projectItemIdUserB = response.body.id;
});

it('should delete comment successfully and return 204', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: `${projectItemConfig.commentText}1`,
		})
		.expect(200);

	const comment2Id = response.body.id;

	response = await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments/${comment1Id}`
		)
		.set('Cookie', cookieUserA)
		.expect(204);

	response = await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectIdUserA}`
		)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.comments.length).toEqual(1);
	expect(response.body.comments[0].text).toEqual(
		projectItemConfig.commentText
	);

	response = await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments/${comment2Id}`
		)
		.set('Cookie', cookieUserA)
		.expect(204);

	expect(response.body.comments.length).toEqual(0);
});

it('should return 422 if comment with given ID does not exist', async () => {
	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments/${projectConfig.testProjectId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if comment ID is not in a valid mongodb format', async () => {
	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments/${projectConfig.testProjectInvalidId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project item with given ID does not exist', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectConfig.testProjectId}/comments/${comment1Id}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project item ID is not in a valid mongodb format', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectConfig.testProjectInvalidId}/comments/${comment1Id}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project with given ID does not exist', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}/items/${projectItemIdUserA}/comments/${comment1Id}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project ID is not in valid mongodb format', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectInvalidId}/items/${projectItemIdUserA}/comments/${comment1Id}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 403 if user is not signed in', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments/${comment1Id}`
		)
		.expect(403);
});

it('should return 403 if user is not the owner of the project', async () => {
	let response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(200);

	const comment1Id = response.body.id;

	await request(app)
		.delete(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments/${comment1Id}`
		)
		.set('Cookie', cookieUserB)
		.expect(403);
});
