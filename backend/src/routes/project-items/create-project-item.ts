import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateRequest } from '../../middleware/validate-request';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { validateCategoryValue } from '../../services/validate-category-value';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { ForbiddenResourceError } from '../../errors/forbidden-resource-error';
import { serializeProjectItem } from '../../services/serialize-project-item';
import { Project } from '../../models/project';
import { ProjectItem } from '../../models/project-item';

const router = Router();

router.post(
	'/projects/:projectId/items',
	currentUser,
	requireAuth,
	[
		body('description')
			.notEmpty()
			.withMessage('Description field is required'),
		body('title').notEmpty().withMessage('Title field is required'),
		body('category')
			.custom(validateCategoryValue)
			.withMessage('allowed category values: task, issue'),
	],
	validateRequest,
	validateMongoId,
	async (req: Request, res: Response) => {
		const { projectId } = req.params;
		const { category, title, description } = req.body;

		const project = await Project.findById(projectId);

		// check whether project with specified ID exists
		if (!project) {
			throw new CustomRequestValidationError(
				`Project with id ${projectId} does not exist`
			);
		}

		// check whether current user is owner of the project
		if (project.ownerId.toString() !== req.currentUser!.id) {
			throw new ForbiddenResourceError();
		}

		// can't create items in closed project
		if (project.isFinished) {
			throw new CustomRequestValidationError('This project is closed');
		}

		const projectItem = await ProjectItem.build({
			projectId,
			title,
			description,
			category,
		}).save();

		return res.status(201).send(serializeProjectItem(projectItem));
	}
);

export { router as createProjectItemRouter };
