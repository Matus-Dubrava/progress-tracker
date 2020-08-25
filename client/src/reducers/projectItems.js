import _ from 'lodash';

import {
	FETCH_PROJECT_ITEMS,
	CREATE_PROJECT_ITEM,
	FETCH_PROJECT_ITEM,
	UPDATE_PROJECT_ITEM,
	DELETE_PROJECT_ITEM,
} from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_PROJECT_ITEMS:
			return { ..._.mapKeys(action.payload, 'id') };
		case CREATE_PROJECT_ITEM:
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_PROJECT_ITEM:
			return { ...state, [action.payload.id]: action.payload };
		case UPDATE_PROJECT_ITEM:
			return { ...state, [action.payload.id]: action.payload };
		case DELETE_PROJECT_ITEM:
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
