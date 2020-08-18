import request from 'supertest';
import moment from 'moment';

import { app } from '../../../app';
import { config as projectConfig } from './config';
import { config as userConfig } from '../../auth/__test__/config';

let userId: string;

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
});

it('should create project correctly', async () => {
	const response = await request(app)
		.post(projectConfig.baseProjectUrl)
		.send({
			name: projectConfig.testProjectName,
			description: projectConfig.testProjectDescription,
			ownerId: userId,
		})
		.expect(201);

	const project = response.body;

	const currentDate = moment().format().split('T')[0];

	expect(project.name).toEqual(projectConfig.testProjectName);
	expect(project.ownerId).toEqual(userId);
	expect(project.isFinished).toBeFalsy();
	expect(project.dateFinished).toBeNull();
	expect(project.dateCreated.split('T')[0]).toEqual(currentDate);
	expect(project.dateUpdated.split('T')[0]).toEqual(currentDate);
	expect(project.id).not.toBeNull();
});

it('should fail with 422 if any of the required attributes is not set [name, description, ownerId]', async () => {});

it('should fail with 422 if supplied owner id does not belong to any existing user', async () => {});

it('should fail with 422 if project with supplied name already exists', async () => {});

it('should fail with 403 if user is not signed in', async () => {});
