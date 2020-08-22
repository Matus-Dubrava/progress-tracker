import _ from 'lodash';

import {
	FETCH_PROJECTS,
	CREATE_PROJECT,
	DELETE_PROJECT,
	UPDATE_PROJECT,
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_PROJECTS:
			return { ...state, ..._.mapKeys(action.payload, 'id') };
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

// export default (state = [], action) => {
// 	switch (action.type) {
// 		case FETCH_PROJECTS:
// 			return action.payload;
// 		case CREATE_PROJECT:
// 			return [action.payload, ...state];
// 		case DELETE_PROJECT:
// 			return state.filter((project) => project.id !== action.payload);
// 		default:
// 			return state;
// 	}
// };
