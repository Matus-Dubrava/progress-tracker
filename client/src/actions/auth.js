import authServer from '../apis/backedServer';

import { SIGN_IN, SIGN_OUT, SET_AUTH_FORM_MESSAGE } from './types';
import history from '../history';

export const signIn = ({ email, password }) => async (dispatch) => {
	try {
		const response = await authServer.post('/auth/signin', {
			email,
			password,
		});
		dispatch({
			type: SIGN_IN,
			payload: {
				name: response.data.name,
				email: response.data.email,
				id: response.data.id,
			},
		});
		history.push('/');
	} catch (err) {
		// handle 422 status code by setting form error message
		// this is due to error(s) made by user
		if (err.response.status === 422) {
			dispatch({
				type: SET_AUTH_FORM_MESSAGE,
				payload: err.response.data,
			});
		} else {
			// this error was not expected
			console.log(err);
		}
	}
};

export const signOut = () => async (dispath) => {
	try {
		await authServer.get('/auth/signout');
		history.push('/');
		dispath({
			type: SIGN_OUT,
		});
	} catch (err) {
		console.log(err);
	}
};

export const signUp = ({ name, email, password }) => async (dispatch) => {
	try {
		const response = await authServer.post('/auth/signup', {
			email,
			name,
			password,
		});
		history.push('/');
		dispatch({
			type: SIGN_IN,
			payload: {
				name: response.data.name,
				email: response.data.email,
				id: response.data.id,
			},
		});
	} catch (err) {
		// handle 422 status code by setting form error message
		// this is due to error(s) made by user
		if (err.response.status === 422) {
			dispatch({
				type: SET_AUTH_FORM_MESSAGE,
				payload: err.response.data,
			});
		} else {
			// this error was not expected
			console.log(err);
		}
	}
};

export const getLoginStatus = () => async (dispatch) => {
	try {
		console.log('getting login status');
		const response = await authServer.get('/auth/current-user');

		if (response.data.currentUser) {
			const { currentUser } = response.data;
			dispatch({
				type: SIGN_IN,
				payload: {
					name: currentUser.name,
					email: currentUser.email,
					id: currentUser.id,
				},
			});
		} else {
			dispatch({
				type: SIGN_OUT,
			});
		}
	} catch (err) {
		console.log(err);
	}
};

// Clear authentication form messages that appear in form component when
// - invalid authentication credentials are supplied (signin)
// - email address is taken  (signup)
export const clearAuthFormMessage = () => {
	return {
		type: SET_AUTH_FORM_MESSAGE,
		payload: [],
	};
};
