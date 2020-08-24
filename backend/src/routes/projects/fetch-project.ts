import { Router, Request, Response } from 'express';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { Project } from '../../models/project';
import { NotFoundError } from '../../errors/not-found-error';
import { RequestForbiddenError } from '../../errors/request-forbidden-error';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';
import { serializeProject } from '../../services/serialize-project';

const router = Router();

router.get(
	'/projects/:projectId',
	currentUser,
	requireAuth,
	validateMongoId,
	async (req: Request, res: Response) => {
		const { projectId } = req.params;

		const project = await Project.findById(projectId);

		if (!project) {
			throw new NotFoundError(`Project with ${projectId} does not exist`);
		}

		// users can access only their own projects
		if (project.ownerId.toString() !== req.currentUser!.id) {
			throw new RequestUnathorizedError();
		}

		return res.send(serializeProject(project));
	}
);

export { router as fetchProjectRouter };
