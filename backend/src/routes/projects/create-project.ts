import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { Project } from '../../models/project';
import { validateRequest } from '../../middleware/validate-request';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { User } from '../../models/user';

const router = Router();

router.post(
	'/projects',
	[
		body('name').notEmpty().withMessage('Name field is required'),
		body('description')
			.notEmpty()
			.withMessage('Description field is required'),
		body('ownerId').notEmpty().withMessage('OwnerId field is required'),
	],
	validateRequest,
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const { name, description } = req.body;
		const ownerId = req.currentUser!.id;

		// name of the project should be unique
		const existingProject = await Project.findOne({ name });
		if (existingProject) {
			throw new CustomRequestValidationError('Project already exists');
		}

		// supplied ownerId must belong to some existing user
		const user = await User.findById(ownerId);
		if (!user) {
			throw new CustomRequestValidationError(
				`User with id ${ownerId} does not exist`
			);
		}

		const project = await Project.build({
			name,
			description,
			ownerId,
		}).save();

		return res.status(201).send(project);
	}
);

export { router as createProjectRouter };
