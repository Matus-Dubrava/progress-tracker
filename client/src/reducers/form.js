import { SET_FORM_MESSAGE } from '../actions/types';

export default (state = [], action) => {
	switch (action.type) {
		case SET_FORM_MESSAGE:
			return action.payload;
		default:
			return state;
	}
};
