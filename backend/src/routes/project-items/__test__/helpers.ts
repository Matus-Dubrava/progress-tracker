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

export const updateProjectItemComment = async ({
	cookie = undefined,
	projectId,
	itemId,
	commentId,
	text = undefined,
	expect,
}: {
	cookie?: string;
	projectId: string;
	itemId: string;
	commentId: string;
	text?: string;
	expect: number;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.post(
				`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}/comments/${commentId}`
			)
			.set('Cookie', cookie)
			.send({
				text,
			})
			.expect(expect);
	} else {
		return await request(app)
			.post(
				`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}/comments/${commentId}`
			)
			.send({
				text,
			})
			.expect(expect);
	}
};
