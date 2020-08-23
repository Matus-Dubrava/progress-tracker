import { FETCH_PROJECTS_SUMMARY } from '../actions/types';

const INITIAL_STATE = {
	totalProjectsCount: null,
	activeProjectsCount: null,
	finishedProjectsCount: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FETCH_PROJECTS_SUMMARY:
			return {
				...state,
				totalProjectsCount: action.payload.totalProjectsCount,
				activeProjectsCount: action.payload.activeProjectsCount,
				finishedProjectsCount: action.payload.finishedProjectsCount,
			};
		default:
			return state;
	}
};
