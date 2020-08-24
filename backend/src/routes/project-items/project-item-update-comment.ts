import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import moment from 'moment';
import mongoose from 'mongoose';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import { validateMongoIdFormat } from '../../services/validate-mongo-id-format';
import { validateProjectByIdExistence } from '../../services/validate-project-by-id-existence';
import { validateProjectItemByIdExistence } from '../../services/validate-project-item-by-id-existence';
import { validateCommentByIdExistence } from '../../services/validate-comment-by-id-existence';
import { Project } from '../../models/project';
import { ProjectItem } from '../../models/project-item';
import { RequestForbiddenError } from '../../errors/request-forbidden-error';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';
import { serializeProjectItem } from '../../services/serialize-project-item';

const router = Router();

router.post(
	'/projects/:projectId/items/:itemId/comments/:commentId',
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
		param('commentId')
			.custom(validateMongoIdFormat)
			.withMessage('Comment ID is not a valid mongodb ID'),
		param('commentId')
			.custom(validateCommentByIdExistence)
			.withMessage(`Comment with given ID does not exist`),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { projectId, commentId, itemId } = req.params;
		const { text } = req.body;

		const project = await Project.findById(projectId);
		if (project!.ownerId.toString() !== req.currentUser!.id) {
			throw new RequestUnathorizedError();
		}

		const now = new Date(moment().format());
		await Project.findByIdAndUpdate(projectId, { dateUpdated: now });
		await ProjectItem.findByIdAndUpdate(itemId, { dateUpdated: now });

		await ProjectItem.updateOne(
			{
				_id: mongoose.Types.ObjectId(itemId),
				'comments._id': mongoose.Types.ObjectId(commentId),
			},
			{ $set: { 'comments.$.text': text } }
		);

		const projectItem = await ProjectItem.findById(itemId);

		return res.send(serializeProjectItem(projectItem!));
	}
);

export { router as projectItemUpdateCommentRouter };
