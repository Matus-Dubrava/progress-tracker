import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as projectConfig } from './config';
import { config as userConfig } from '../../auth/__test__/config';
import { parseCookieFromResponse } from '../../auth/__test__/helpers';

let userId: string;
let cookie: string;

beforeEach(async () => {
	let response = await request(app)
		.post(userConfig.signupPostUrl)
		.send({
			name: userConfig.testName,
			password: userConfig.testPassword,
			email: userConfig.testEmail,
		})
		.expect(201);

	userId = response.body.id;
	cookie = parseCookieFromResponse(response);
});

it('should create project correctly', async () => {
	const response = await request(app)
		.post(projectConfig.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			name: projectConfig.testProjectName1,
			description: projectConfig.testProjectDescription,
			ownerId: userId,
		})
		.expect(201);

	const project = response.body;

	const currentDate = moment().format().split('T')[0];

	expect(project.name).toEqual(projectConfig.testProjectName1);
	expect(project.ownerId).toEqual(userId);
	expect(project.isFinished).toBeFalsy();
	expect(project.dateFinished).toBeUndefined();
	expect(project.dateCreated.split('T')[0]).toEqual(currentDate);
	expect(project.dateUpdated.split('T')[0]).toEqual(currentDate);
	expect(project.id).not.toBeNull();
});

it('should fail with 422 if any of the required attributes is not set [name, description]', async () => {
	await request(app)
		.post(projectConfig.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			description: projectConfig.testProjectDescription,
		})
		.expect(422);

	await request(app)
		.post(projectConfig.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			name: projectConfig.testProjectName1,
		})
		.expect(422);
});

it('should fail with 422 if supplied owner id does not belong to any existing user', async () => {
	await request(app)
		.delete(`${userConfig.baseAuthUrl}/${userId}`)
		.set('Cookie', cookie)
		.expect(204);

	await request(app)
		.post(projectConfig.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			name: projectConfig.testProjectName1,
			description: projectConfig.testProjectDescription,
			ownerId: `${userId}`,
		})
		.expect(422);
});

it('should fail with 422 if project with supplied name already exists', async () => {
	await request(app)
		.post(projectConfig.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			name: projectConfig.testProjectName1,
			description: projectConfig.testProjectDescription,
			ownerId: userId,
		})
		.expect(201);

	await request(app)
		.post(projectConfig.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			name: projectConfig.testProjectName1,
			description: projectConfig.testProjectDescription,
			ownerId: userId,
		})
		.expect(422);
});

it('should fail with 403 if user is not signed in', async () => {
	await request(app)
		.post(projectConfig.baseProjectUrl)
		.send({
			name: projectConfig.testProjectName1,
			description: projectConfig.testProjectDescription,
			ownerId: userId,
		})
		.expect(403);
});
