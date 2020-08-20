import backendServer from '../apis/backedServer';

import { FETCH_PROJECTS } from './types';

export const fetchProjects = () => async (dispatch) => {
	try {
		const response = await backendServer.get('/projects', {
			withCredentials: true,
		});

		dispatch({
			type: FETCH_PROJECTS,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};
