import { Router, Request, Response } from 'express';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { Project } from '../../models/project';
import { NotFoundError } from '../../errors/not-found-error';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { ForbiddenResourceError } from '../../errors/forbidden-resource-error';
import { serializeProject } from '../../services/serialize-project';

const router = Router();

router.get(
	'/projects/:id',
	currentUser,
	requireAuth,
	validateMongoId,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const project = await Project.findById(id);

		if (!project) {
			throw new NotFoundError(`Project with ${id} does not exist`);
		}

		// users can access only their own projects
		if (project.ownerId.toString() !== req.currentUser!.id) {
			throw new ForbiddenResourceError();
		}

		return res.send(serializeProject(project));
	}
);

export { router as fetchProjectRouter };
