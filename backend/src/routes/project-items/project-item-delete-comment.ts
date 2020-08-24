import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateRequest } from '../../middleware/validate-request';
import { param } from 'express-validator';
import { validateMongoIdFormat } from '../../services/validate-mongo-id-format';
import { validateProjectByIdExistence } from '../../services/validate-project-by-id-existence';
import { validateProjectItemByIdExistence } from '../../services/validate-project-item-by-id-existence';
import { validateCommentByIdExistence } from '../../services/validate-comment-by-id-existence';
import { Project } from '../../models/project';
import { ProjectItem } from '../../models/project-item';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';

const router = Router();

router.delete(
	`/projects/:projectId/items/:itemId/comments/:commentId`,
	currentUser,
	requireAuth,
	[
		param('projectId')
			.custom(validateMongoIdFormat)
			.withMessage('Project ID is not a valid mongodb ID'),
		param('projectId')
			.custom(validateProjectByIdExistence)
			.withMessage(`Project with given ID does not exist`),
		param('itemId')
			.custom(validateMongoIdFormat)
			.withMessage('Project item ID is not a valid mongodb ID'),
		param('itemId')
			.custom(validateProjectItemByIdExistence)
			.withMessage('Project item with given ID does not exist'),
		param('commentId')
			.custom(validateMongoIdFormat)
			.withMessage('Comment ID is not a valid mongodb ID'),
		param('commentId')
			.custom(validateCommentByIdExistence)
			.withMessage('Comment with given ID does not exist'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { commentId, projectId, itemId } = req.params;

		const project = await Project.findById(projectId);
		if (project!.ownerId.toString() !== req.currentUser!.id) {
			throw new RequestUnathorizedError();
		}

		await ProjectItem.updateOne(
			{ _id: itemId },
			{
				$pull: {
					comments: {
						_id: mongoose.Types.ObjectId(commentId),
					},
				},
			},
			{ new: true }
		);

		return res.sendStatus(204);
	}
);

export { router as projectItemDeleteCommentRouter };
