// validate category that is send with POST request
export const validateCategoryValue = (value: string) => {
	if (value !== 'task' && value !== 'issue') {
		throw new Error('allowed category values: task, issue');
	}

	return true;
};
