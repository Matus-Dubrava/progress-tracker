import { Router, Request, Response } from 'express';
import { param, body } from 'express-validator';
import moment from 'moment';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateMongoIdFormat } from '../../services/validate-mongo-id-format';
import { validateProjectByIdExistence } from '../../services/validate-project-by-id-existence';
import { validateProjectItemByIdExistence } from '../../services/validate-project-item-by-id-existence';
import { validateCategoryValueOnUpdate } from '../../services/validate-category-value-on-update';
import { validateRequest } from '../../middleware/validate-request';
import { Project } from '../../models/project';
import { ProjectItem } from '../../models/project-item';
import { RequestForbiddenError } from '../../errors/request-forbidden-error';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';
import { serializeProjectItem } from '../../services/serialize-project-item';

const router = Router();

router.post(
	'/projects/:projectId/items/:itemId',
	currentUser,
	requireAuth,
	[
		body('category')
			.custom(validateCategoryValueOnUpdate)
			.withMessage('allowed category values: task, issue'),
		param('projectId')
			.custom(validateMongoIdFormat)
			.withMessage('Project ID is not a valid mongodb ID'),
		param('projectId')
			.custom(validateProjectByIdExistence)
			.withMessage('Project with given ID does not exist'),
		param('itemId')
			.custom(validateMongoIdFormat)
			.withMessage('Project item ID is not a valid mongodb ID'),
		param('itemId')
			.custom(validateProjectItemByIdExistence)
			.withMessage('Project item with given ID does not exist'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { projectId, itemId } = req.params;
		const { description, title, category, isFinished } = req.body;

		const project = await Project.findById(projectId);
		if (project!.ownerId.toString() !== req.currentUser!.id) {
			throw new RequestUnathorizedError();
		}

		const oldProjectItem = await ProjectItem.findById(itemId);

		// not using omit true because we may want to set dateFinished to undefined
		// when isFinished is set to false
		const newProjectItem = await ProjectItem.findByIdAndUpdate(
			itemId,
			{
				description:
					description !== undefined
						? description
						: oldProjectItem?.description,
				title: title !== undefined ? title : oldProjectItem?.title,
				category:
					category !== undefined
						? category
						: oldProjectItem?.category,
				isFinished:
					isFinished !== undefined
						? isFinished
						: oldProjectItem?.isFinished,
				dateFinished:
					isFinished === true
						? new Date(moment().format())
						: undefined,
			},
			{
				new: true,
			}
		);

		return res.send(serializeProjectItem(newProjectItem!));
	}
);

export { router as updateProjectItemRouter };
