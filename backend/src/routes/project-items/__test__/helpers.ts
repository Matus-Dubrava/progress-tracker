import request from 'supertest';

import { ProjectItemCategory } from '../../../models/project-item';
import { config as projectItemConfig } from './config';
import { config as projectConfig } from '../../projects/__test__/config';
import { app } from '../../../app';

export const createProjectItem = async ({
	cookie,
	category,
	projectId,
	expect,
	title = projectItemConfig.testTitle,
	description = projectItemConfig.testDescription,
}: {
	cookie?: string;
	category?: ProjectItemCategory;
	projectId: string;
	expect: number;
	title?: string;
	description?: string;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.post(`${projectConfig.baseProjectUrl}/${projectId}/items`)
			.set('Cookie', cookie)
			.send({
				projectId,
				title,
				description,
				category,
			})
			.expect(expect);
	} else {
		return await request(app)
			.post(`${projectConfig.baseProjectUrl}/${projectId}/items`)
			.send({
				projectId,
				title,
				description,
				category,
			})
			.expect(expect);
	}
};

export const createProjectItemComment = async ({
	cookie,
	projectId,
	itemId,
	text,
	expect,
}: {
	cookie?: string;
	projectId: string;
	itemId: string;
	text?: string;
	expect: number;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.post(
				`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}/comments`
			)
			.set('Cookie', cookie)
			.send({
				text,
			})
			.expect(expect);
	} else {
		return await request(app)
			.post(
				`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}/comments`
			)
			.send({
				text,
			})
			.expect(expect);
	}
};

export const updateProjectItemComment = async ({
	cookie,
	projectId,
	itemId,
	commentId,
	text,
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

export const fetchProjectItem = async ({
	cookie,
	projectId,
	itemId,
	expect,
}: {
	cookie?: string;
	projectId: string;
	itemId: string;
	expect: number;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.get(`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}`)
			.set('Cookie', cookie)
			.expect(expect);
	} else {
		return await request(app)
			.get(`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}`)
			.expect(expect);
	}
};

export const fetchProject = async ({
	cookie,
	projectId,
	expect,
}: {
	cookie?: string;
	projectId: string;
	expect: number;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.get(`${projectConfig.baseProjectUrl}/${projectId}`)
			.set('Cookie', cookie)
			.expect(expect);
	} else {
		return await request(app)
			.get(`${projectConfig.baseProjectUrl}/${projectId}`)
			.expect(expect);
	}
};

export const deleteProjectItemComment = async ({
	cookie,
	projectId,
	itemId,
	commentId,
	expect,
}: {
	cookie?: string;
	projectId: string;
	itemId: string;
	commentId: string;
	expect: number;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.delete(
				`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}/comments/${commentId}`
			)
			.set('Cookie', cookie)
			.expect(expect);
	} else {
		return await request(app)
			.delete(
				`${projectConfig.baseProjectUrl}/${projectId}/items/${itemId}/comments/${commentId}`
			)
			.expect(expect);
	}
};
