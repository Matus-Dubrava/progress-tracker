import { combineReducers } from 'redux';

import authReducer from './auth';
import formReducer from './form';
import projectsReducer from './projects';

export default combineReducers({
	auth: authReducer,
	form: formReducer,
	projects: projectsReducer,
});
