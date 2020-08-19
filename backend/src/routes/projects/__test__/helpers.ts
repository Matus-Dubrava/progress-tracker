import request from 'supertest';

import { app } from '../../../app';
import { config } from './config';

export const createProject = async (
	userId: string,
	cookie: string,
	projectName: string
): Promise<request.Response> => {
	return await request(app)
		.post(config.baseProjectUrl)
		.set('Cookie', cookie)
		.send({
			ownerId: userId,
			name: projectName,
			description: config.testProjectDescription,
		})
		.expect(201);
};
