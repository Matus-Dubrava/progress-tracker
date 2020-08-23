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

it('should successfully create comment and return properly serialized comment', async () => {
	const response = await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(201);

	expect(response.body.text).toEqual(projectItemConfig.commentText);
	expect(response.body.dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);

	expect(response.body.id).toBeDefined();
	expect(response.body._id).toBeUndefined();
	expect(response.body.__v).toBeUndefined();
});

it('should return 422 if required attribute [text] is not specified', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({})
		.expect(422);
});

it('should return 422 if project with specified ID does not exist', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(422);
});

it('should return 422 if project ID is not in the valid mongodb ID format', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectInvalidId}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(422);
});

it('should return 422 if project item with specified ID does not exist', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectConfig.testProjectId}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(422);
});

it('should return 422 if project item ID is not in the valid mongodb ID format', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectConfig.testProjectInvalidId}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(422);
});

it('should return 403 if user is not the owner of the project', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserB)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(403);
});

it('should return 403 if user is not signed in', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.send({
			text: projectItemConfig.commentText,
		})
		.expect(403);
});
