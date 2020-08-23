import backendServer from '../apis/backedServer';

import history from '../history';
import {
	FETCH_PROJECTS,
	FETCH_PROJECTS_SUMMARY,
	FETCH_PROJECT,
	CREATE_PROJECT,
	SET_FORM_MESSAGE,
	DELETE_PROJECT,
	UPDATE_PROJECT,
} from './types';

export const fetchProject = (id) => async (dispatch) => {
	try {
		const response = await backendServer.get(`/projects/${id}`);

		dispatch({
			type: FETCH_PROJECT,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};

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

export const createProject = ({ name, description }) => async (dispatch) => {
	try {
		const response = await backendServer.post(
			'/projects',
			{
				name,
				description,
			},
			{
				withCredentials: true,
			}
		);

		dispatch({
			type: CREATE_PROJECT,
			payload: {
				project: response.data,
			},
		});

		history.push('/projects');
	} catch (err) {
		console.log(err);
		// handle 422 status code by setting form error message
		// this is due to error(s) made by user
		if (err.response.status === 422) {
			dispatch({
				type: SET_FORM_MESSAGE,
				payload: err.response.data,
			});
		} else {
			// this error was not expected
			console.log(err);
		}
	}
};

export const deleteProject = (id) => async (dispatch) => {
	try {
		await backendServer.delete(`/projects/${id}`);
		dispatch({
			type: DELETE_PROJECT,
			payload: id,
		});
	} catch (err) {
		console.log(err);
	}
};

export const updateProject = ({ id, description, isFinished }) => async (
	dispatch
) => {
	try {
		const response = await backendServer.post(`/projects/${id}`, {
			id,
			description,
			isFinished,
		});
		dispatch({
			type: UPDATE_PROJECT,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const fetchProjectsSummary = () => async (dispatch) => {
	try {
		const response = await backendServer.get('/projects/summary');
		dispatch({
			type: FETCH_PROJECTS_SUMMARY,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};
