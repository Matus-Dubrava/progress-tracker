import { Router, Request, Response } from 'express';
import { param } from 'express-validator';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateMongoIdFormat } from '../../services/validate-mongo-id-format';
import { validateProjectByIdExistence } from '../../services/validate-project-by-id-existence';
import { validateProjectItemByIdExistence } from '../../services/validate-project-item-by-id-existence';
import { validateRequest } from '../../middleware/validate-request';
import { Project } from '../../models/project';
import { ProjectItem } from '../../models/project-item';
import { RequestForbiddenError } from '../../errors/request-forbidden-error';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';
import { serializeProjectItem } from '../../services/serialize-project-item';

const router = Router();

router.delete(
	'/projects/:projectId/items/:itemId',
	currentUser,
	requireAuth,
	[
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
		const { itemId, projectId } = req.params;

		const project = await Project.findById(projectId);
		if (project!.ownerId.toString() !== req.currentUser!.id) {
			throw new RequestUnathorizedError();
		}

		await ProjectItem.findByIdAndDelete(itemId);

		return res.sendStatus(204);
	}
);

export { router as deleteProjectItemRouter };
