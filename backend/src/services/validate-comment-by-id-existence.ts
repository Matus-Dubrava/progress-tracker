import { Meta } from 'express-validator';
import { ProjectItem } from '../models/project-item';
import { CustomRequestValidationError } from '../errors/custom-request-validation-error';

// validate whether comment with given commentId exists
export const validateCommentByIdExistence = async (
	commentId: string,
	meta: Meta
) => {
	const { itemId } = meta.req.params as {
		itemId: string;
	};

	const projectItem = await ProjectItem.findById(itemId);

	let commentExists = false;

	projectItem?.comments.forEach((comment) => {
		if (comment._id.toString() === commentId) {
			commentExists = true;
		}
	});

	if (!commentExists) {
		throw new CustomRequestValidationError(
			`Comment with ID ${commentId} does not exist`
		);
	}

	return true;
};
