import request from 'supertest';

import { app } from '../../../app';
import { config } from './config';

export const createProject = async (
	cookie: string,
	projectName: string
): Promise<request.Response> => {
	return await request(app)
		.post(config.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			name: projectName,
			description: config.testProjectDescription,
		})
		.expect(201);
};

export const updateProject = async ({
	cookie,
	projectId,
	isFinished,
	description,
	expect,
}: {
	cookie: string;
	projectId: string;
	isFinished?: boolean;
	description?: string;
	expect: number;
}): Promise<request.Response> => {
	if (cookie) {
		return await request(app)
			.post(`${config.baseProjectUrl}/${projectId}`)
			.set('Cookie', cookie)
			.send({
				isFinished,
				description,
			})
			.expect(expect);
	} else {
		return await request(app)
			.post(`${config.baseProjectUrl}/${projectId}`)
			.send({
				isFinished,
				description,
			})
			.expect(expect);
	}
};
