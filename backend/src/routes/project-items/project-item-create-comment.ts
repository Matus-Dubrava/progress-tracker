import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import { validateMongoIdFormat } from '../../services/validate-mongo-id-format';
import { validateProjectByIdExistence } from '../../services/validate-project-by-id-existence';
import { validateProjectItemByIdExistence } from '../../services/validate-project-item-by-id-existence';
import { Comment } from '../../models/comment';
import { ProjectItem } from '../../models/project-item';
import { Project } from '../../models/project';
import { ForbiddenResourceError } from '../../errors/forbidden-resource-error';
import { serializeProjectItem } from '../../services/serialize-project-item';

const router = Router();

router.post(
	`/projects/:projectId/items/:itemId/comments`,
	currentUser,
	requireAuth,
	[
		body('text')
			.notEmpty()
			.isLength({ min: 15 })
			.withMessage('Requered at least 15 characters'),
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
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { text } = req.body;
		const { projectId, itemId } = req.params;

		const project = await Project.findById(projectId);

		if (project!.ownerId.toString() !== req.currentUser!.id) {
			throw new ForbiddenResourceError();
		}

		const comment = Comment.build({ text });

		const projectItem = await ProjectItem.findByIdAndUpdate(
			itemId,
			{ $push: { comments: comment } },
			{ new: true }
		);

		return res.send(serializeProjectItem(projectItem!));
	}
);

export { router as projectItemCreateCommentRouter };
