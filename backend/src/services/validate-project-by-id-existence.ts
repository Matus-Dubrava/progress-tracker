import { Project } from '../models/project';
import { CustomRequestValidationError } from '../errors/custom-request-validation-error';

// validate whether project with given projectId exists
export const validateProjectByIdExistence = async (projectId: string) => {
	const project = await Project.findById(projectId);

	if (!project) {
		throw new CustomRequestValidationError(
			`Project with ID ${projectId} does not exist`
		);
	}

	return true;
};
