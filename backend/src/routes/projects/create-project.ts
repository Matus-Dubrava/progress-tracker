import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { Project } from '../../models/project';
import { validateRequest } from '../../middleware/validate-request';
import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';

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
		try {
			const project = await Project.build({
				name: 'test project1',
				description: 'for testing purposes',
				ownerId: '5f3920ddd4984d006a102360',
			}).save();
		} catch (err) {
			console.log(err);
		}

		return res.status(201).send('Testing project creation');
	}
);

export { router as createProjectRouter };
