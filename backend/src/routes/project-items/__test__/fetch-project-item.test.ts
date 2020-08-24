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
});

it('should return corretly serialized project item', async () => {
	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({ text: projectItemConfig.commentText })
		.expect(200);

	await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}/comments`
		)
		.set('Cookie', cookieUserA)
		.send({ text: `${projectItemConfig.commentText}1` })
		.expect(200);

	const response = await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}`
		)
		.set('Cookie', cookieUserA)
		.expect(200);

	expect(response.body.id).toEqual(projectItemIdUserA);
	expect(response.body._id).toBeUndefined();
	expect(response.body.__v).toBeUndefined();
	expect(response.body.title).toEqual(projectItemConfig.testTitle);
	expect(response.body.description).toEqual(
		projectItemConfig.testDescription
	);
	expect(response.body.dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
	expect(response.body.dateUpdated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
	expect(response.body.dateFinished).toBeFalsy();

	expect(response.body.comments.length).toEqual(2);
	expect(response.body.comments[0].text).toEqual(
		projectItemConfig.commentText
	);
	expect(response.body.comments[0].dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
	expect(response.body.comments[1].text).toEqual(
		`${projectItemConfig.commentText}1`
	);
	expect(response.body.comments[1].dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
});

it('should return 422 if project with given ID does not exist', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectId}/items/${projectItemIdUserA}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project ID is not in valid mongodb ID format', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectConfig.testProjectInvalidId}/items/${projectItemIdUserA}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project item with given ID does not exist', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectConfig.testProjectId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 422 if project item ID is not valid mongodb ID format', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectConfig.testProjectInvalidId}`
		)
		.set('Cookie', cookieUserA)
		.expect(422);
});

it('should return 403 if user is not signed in', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}`
		)
		.expect(403);
});

it('should return 403 if user is not the owner of the project', async () => {
	await request(app)
		.get(
			`${projectConfig.baseProjectUrl}/${projectIdUserA}/items/${projectItemIdUserA}`
		)
		.set('Cookie', cookieUserB)
		.expect(403);
});
