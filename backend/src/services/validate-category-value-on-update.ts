import { ProjectItemCategory } from '../models/project-item';

// validate category that is send with POST request
// category can be undefined when the item is being updated
export const validateCategoryValueOnUpdate = (value: string) => {
	if (
		value !== ProjectItemCategory.Issue &&
		value !== ProjectItemCategory.Task &&
		value !== undefined
	) {
		throw new Error(
			`allowed category values: ${ProjectItemCategory.Task}, ${ProjectItemCategory.Issue} or undefined`
		);
	}

	return true;
};
