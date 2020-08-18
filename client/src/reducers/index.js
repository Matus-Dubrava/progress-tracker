import { combineReducers } from 'redux';

import authReducer from './auth';
import authFormReducer from './authForm';

export default combineReducers({
	auth: authReducer,
	authForm: authFormReducer,
});
