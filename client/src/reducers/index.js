import { combineReducers } from 'redux';

import authReducer from './auth';
import authFormReducer from './authForm';
import projectsReducer from './projects';

export default combineReducers({
	auth: authReducer,
	authForm: authFormReducer,
	projects: projectsReducer,
});
