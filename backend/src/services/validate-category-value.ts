import { ProjectItemCategory } from '../models/project-item';

// validate category that is send with POST request
export const validateCategoryValue = (value: string) => {
	if (
		value !== ProjectItemCategory.Issue &&
		value !== ProjectItemCategory.Task
	) {
		throw new Error(
			`allowed category values: ${ProjectItemCategory.Task}, ${ProjectItemCategory.Issue}`
		);
	}

	return true;
};
