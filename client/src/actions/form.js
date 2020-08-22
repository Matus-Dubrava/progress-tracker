import { SET_FORM_MESSAGE } from './types';

// Clear form messages that appear in form component
export const clearFormMessages = () => {
	return {
		type: SET_FORM_MESSAGE,
		payload: [],
	};
};
