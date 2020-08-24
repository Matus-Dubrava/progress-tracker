import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import moment from 'moment';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { validateRequest } from '../../middleware/validate-request';
import { Project } from '../../models/project';
import { NotFoundError } from '../../errors/not-found-error';
import { RequestForbiddenError } from '../../errors/request-forbidden-error';
import { RequestUnathorizedError } from '../../errors/request-unauthorized-error';
import { serializeProject } from '../../services/serialize-project';

const router = Router();

router.post(
	'/projects/:projectId',
	currentUser,
	requireAuth,
	validateMongoId,
	[
		body('name')
			.isEmpty()
			.withMessage("name of the project can't be changed"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { projectId } = req.params;
		const { description, isFinished } = req.body;

		const project = await Project.findById(projectId);

		if (!project) {
			throw new NotFoundError(`Project with ${projectId} does not exist`);
		}

		if (project.ownerId.toString() !== req.currentUser!.id) {
			throw new RequestUnathorizedError();
		}

		let dateFinished;
		if (isFinished === undefined) {
			dateFinished = project.dateFinished;
		} else if (isFinished) {
			dateFinished = new Date(moment().format());
		} else {
			dateFinished = undefined;
		}

		// not using omit true because we may want to set dateFinished to undefined
		// when isFinished is set to false
		const updatedProject = await Project.findByIdAndUpdate(
			projectId,
			{
				description:
					description !== undefined
						? description
						: project.description,
				isFinished:
					isFinished !== undefined ? isFinished : project.isFinished,
				dateUpdated: new Date(moment().format()),
				dateFinished,
			},
			{
				// omitUndefined: true,
				new: true,
			}
		);

		return res.send(serializeProject(updatedProject!));
	}
);

export { router as updateProjectRouter };
