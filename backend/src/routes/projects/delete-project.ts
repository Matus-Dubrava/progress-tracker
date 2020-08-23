import { Router, Request, Response } from 'express';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { NotFoundError } from '../../errors/not-found-error';
import { ForbiddenResourceError } from '../../errors/forbidden-resource-error';
import { Project } from '../../models/project';

const router = Router();

router.delete(
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

		await Project.findByIdAndDelete(id);

		return res.sendStatus(204);
	}
);

export { router as deleteProjectRouter };
