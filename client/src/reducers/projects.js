import _ from 'lodash';

import {
	FETCH_PROJECTS,
	FETCH_PROJECT,
	CREATE_PROJECT,
	DELETE_PROJECT,
	UPDATE_PROJECT,
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_PROJECTS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case FETCH_PROJECT:
			return { ...state, [action.payload.id]: action.payload };
		case CREATE_PROJECT:
			return { ...state, [action.payload.id]: action.payload };
		case DELETE_PROJECT:
			return _.omit(state, action.payload);
		case UPDATE_PROJECT:
			return { ...state, [action.payload.id]: action.payload };
		default:
			return state;
	}
};
