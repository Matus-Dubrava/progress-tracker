import authServer from '../apis/authServer';

import { SIGN_IN, SIGN_OUT } from './types';
import history from '../history';

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
		history.push('/');
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
		console.log(err);
	}
};

export const getLoginStatus = () => async (dispatch) => {
	try {
		console.log('getting login status');
		const response = await authServer.get('/current-user');

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
