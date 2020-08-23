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
