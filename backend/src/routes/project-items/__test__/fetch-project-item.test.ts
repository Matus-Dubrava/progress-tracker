import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as userConfig } from '../../auth/__test__/config';
import { config as projectConfig } from '../../projects/__test__/config';
import { config as projectItemConfig } from './config';
import { createProject } from '../../projects/__test__/helpers';
import {
	createProjectItem,
	createProjectItemComment,
	fetchProjectItem,
} from './helpers';
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

it('should return corretly serialized project item', async () => {
	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText1,
		expect: 200,
	});

	await createProjectItemComment({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		text: projectItemConfig.commentText2,
		expect: 200,
	});

	const response = await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 200,
	});

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
		projectItemConfig.commentText1
	);
	expect(response.body.comments[0].dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
	expect(response.body.comments[1].text).toEqual(
		projectItemConfig.commentText2
	);
	expect(response.body.comments[1].dateCreated.split('T')[0]).toEqual(
		moment().format().split('T')[0]
	);
});

it('should return 422 if project with given ID does not exist', async () => {
	await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectId,
		itemId: projectItemIdUserA,
		expect: 422,
	});
});

it('should return 422 if project ID is not in valid mongodb ID format', async () => {
	await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectConfig.testProjectInvalidId,
		itemId: projectItemIdUserA,
		expect: 422,
	});
});

it('should return 422 if project item with given ID does not exist', async () => {
	await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectId,
		expect: 422,
	});
});

it('should return 422 if project item ID is not valid mongodb ID format', async () => {
	await fetchProjectItem({
		cookie: cookieUserA,
		projectId: projectIdUserA,
		itemId: projectConfig.testProjectInvalidId,
		expect: 422,
	});
});

it('should return 401 if user is not signed in', async () => {
	await fetchProjectItem({
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 401,
	});
});

it('should return 401 if user is not the owner of the project', async () => {
	await fetchProjectItem({
		cookie: cookieUserB,
		projectId: projectIdUserA,
		itemId: projectItemIdUserA,
		expect: 401,
	});
});
