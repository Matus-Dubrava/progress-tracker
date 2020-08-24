import { Router, Request, Response } from 'express';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { NotFoundError } from '../../errors/not-found-error';
import { RequestForbiddenError } from '../../errors/request-forbidden-error';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';
import { Project } from '../../models/project';

const router = Router();

router.delete(
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

		await Project.findByIdAndDelete(projectId);

		return res.sendStatus(204);
	}
);

export { router as deleteProjectRouter };
