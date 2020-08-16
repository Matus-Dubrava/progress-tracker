import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
	email: null,
	id: null,
	name: null,
	isSignedIn: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SIGN_IN:
			return {
				...state,
				email: action.payload.email,
				id: action.payload.id,
				isSignedIn: true,
			};
		case SIGN_OUT:
			return { ...state, email: null, id: null, isSignedIn: false };
		default:
			return state;
	}
};
