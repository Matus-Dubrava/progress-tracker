import request from 'supertest';

import { ProjectItemCategory } from '../../../models/project-item';
import { config as projectItemConfig } from './config';
import { config as projectConfig } from '../../projects/__test__/config';
import { app } from '../../../app';

export const createProjectItem = async (
	cookie: string,
	category: ProjectItemCategory,
	projectId: string
): Promise<request.Response> => {
	return await request(app)
		.post(`${projectConfig.baseProjectUrl}/${projectId}/items`)
		.set('Cookie', cookie)
		.send({
			projectId,
			title: projectItemConfig.testTitle,
			description: projectItemConfig.testDescription,
			category,
		})
		.expect(201);
};

export const createProjectItemComment = async (
	cookie: string,
	projectId: string,
	projectItemId: string,
	text: string
): Promise<request.Response> => {
	return await request(app)
		.post(
			`${projectConfig.baseProjectUrl}/${projectId}/items/${projectItemId}/comments`
		)
		.set('Cookie', cookie)
		.send({
			text,
		})
		.expect(200);
};
