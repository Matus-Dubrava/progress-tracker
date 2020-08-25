import backendServer from '../apis/backedServer';
import history from '../history';

import {
	FETCH_PROJECT_ITEMS,
	FETCH_PROJECT_ITEM,
	UPDATE_PROJECT_ITEM,
	CREATE_PROJECT_ITEM,
	DELETE_PROJECT_ITEM,
	SET_FORM_MESSAGE,
	DELETE_PROJECT_ITEM_COMMENT,
} from './types';

export const fetchProjectItems = ({ category, projectId }) => async (
	dispatch
) => {
	try {
		let response;
		if (category) {
			response = await backendServer(
				`/projects/${projectId}/items?category=${category}`
			);
		} else {
			response = await backendServer(`/projects/${projectId}/items`);
		}

		dispatch({
			type: FETCH_PROJECT_ITEMS,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const createProjectItem = ({
	category,
	projectId,
	title,
	description,
}) => async (dispatch) => {
	try {
		const response = await backendServer.post(
			`/projects/${projectId}/items`,
			{
				category,
				title,
				description,
			}
		);
		dispatch({
			type: CREATE_PROJECT_ITEM,
			payload: response.data,
		});
		history.push(`/projects/${projectId}`);
	} catch (err) {
		// handle 422 status code by setting form error message
		// this is due to error(s) made by user
		if (
			err.response.status === 422 ||
			err.response.status === 401 ||
			err.response.status === 403
		) {
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

export const fetchProjectItem = ({ projectId, itemId }) => async (dispatch) => {
	try {
		const response = await backendServer.get(
			`/projects/${projectId}/items/${itemId}`
		);
		dispatch({
			type: FETCH_PROJECT_ITEM,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const updateProjectItemStatus = ({
	isFinished,
	projectId,
	itemId,
}) => async (dispatch) => {
	try {
		const response = await backendServer.post(
			`/projects/${projectId}/items/${itemId}`,
			{ isFinished }
		);
		dispatch({
			type: UPDATE_PROJECT_ITEM,
			payload: response.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const deleteProjectItem = ({ projectId, itemId }) => async (
	dispatch
) => {
	try {
		await backendServer.delete(`/projects/${projectId}/items/${itemId}`);
		dispatch({
			type: DELETE_PROJECT_ITEM,
			payload: itemId,
		});
		history.push(`/projects/${projectId}`);
	} catch (err) {
		console.log(err);
	}
};

export const createComment = ({ projectId, itemId, text }) => async (
	dispatch
) => {
	try {
		const response = await backendServer.post(
			`/projects/${projectId}/items/${itemId}/comments`,
			{ text }
		);
		dispatch({
			type: UPDATE_PROJECT_ITEM,
			payload: response.data,
		});
		history.push(`/projects/${projectId}/items/${itemId}`);
	} catch (err) {
		// handle 422 status code by setting form error message
		// this is due to error(s) made by user
		if (
			err.response.status === 422 ||
			err.response.status === 401 ||
			err.response.status === 403
		) {
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

export const deleteComment = ({ projectId, itemId, commentId }) => async (
	dispatch
) => {
	try {
		await backendServer.delete(
			`/projects/${projectId}/items/${itemId}/comments/${commentId}`
		);
		dispatch({
			type: DELETE_PROJECT_ITEM_COMMENT,
			payload: { commentId, itemId },
		});
	} catch (err) {
		console.log(err);
	}
};
