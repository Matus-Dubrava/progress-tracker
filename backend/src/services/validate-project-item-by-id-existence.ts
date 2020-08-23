import { ProjectItem } from '../models/project-item';
import { CustomRequestValidationError } from '../errors/custom-request-validation-error';

// validate whether project item with given projectId exists
export const validateProjectItemByIdExistence = async (
	projectItemId: string
) => {
	const projectItem = await ProjectItem.findById(projectItemId);

	if (!projectItem) {
		throw new CustomRequestValidationError(
			`Project item with ID ${projectItemId} does not exist`
		);
	}

	return true;
};
