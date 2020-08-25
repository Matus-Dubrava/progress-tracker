import _ from 'lodash';

import {
	FETCH_PROJECT_ITEMS,
	CREATE_PROJECT_ITEM,
	FETCH_PROJECT_ITEM,
	UPDATE_PROJECT_ITEM,
	DELETE_PROJECT_ITEM,
	DELETE_PROJECT_ITEM_COMMENT,
} from '../actions/types';

const deleteProjectItemComment = (state, action) => {
	const item = { ...state[action.payload.itemId] };
	item.comments = item.comments.filter(
		(comment) => comment.id !== action.payload.commentId
	);
	return { ...state, [action.payload.itemId]: item };
};

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
		case DELETE_PROJECT_ITEM_COMMENT:
			return deleteProjectItemComment(state, action);
		default:
			return state;
	}
};
