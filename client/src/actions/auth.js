import authServer from '../apis/authServer';

import { SIGN_IN, SIGN_OUT } from './types';

export const signIn = (email, password) => async (dispatch) => {
	try {
		const response = await authServer.post('/signin', { email, password });
		dispatch({
			type: SIGN_IN,
			payload: {
				name: response.data.name,
				email: response.data.email,
				id: response.data.id,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

export const signOut = () => async (dispath) => {
	try {
		await authServer.get('/signout');
		dispath({
			type: SIGN_OUT,
		});
	} catch (err) {
		console.log(err);
	}
};

export const signUp = (name, email, password) => async (dispatch) => {
	try {
		const response = await authServer.post('/signup', {
			email,
			name,
			password,
		});
		console.log(response.data);
		dispatch({
			type: SIGN_IN,
			payload: {
				name: response.data.name,
				email: response.data.email,
				id: response.data.id,
			},
		});
	} catch (err) {
		console.log(err);
	}
};

export const getLoginStatus = () => async (dispatch) => {
	try {
		const response = await authServer.get('/current-user');

		if (response.data.currentUser) {
			dispatch({
				type: SIGN_IN,
				payload: {
					name: response.data.name,
					email: response.data.email,
					id: response.data.id,
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
