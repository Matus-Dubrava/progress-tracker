import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import moment from 'moment';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import { validateRequest } from '../../middleware/validate-request';
import { Project } from '../../models/project';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { NotFoundError } from '../../errors/not-found-error';
import { ForbiddenResourceError } from '../../errors/forbidden-resource-error';
import { serializeProject } from '../../services/serialize-project';

const router = Router();

router.post(
	'/projects/:id',
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
		const { id } = req.params;
		const { description, isFinished } = req.body;

		const project = await Project.findById(id);

		if (!project) {
			throw new NotFoundError(`Project with ${id} does not exist`);
		}

		if (project.ownerId.toString() !== req.currentUser!.id) {
			throw new ForbiddenResourceError();
		}

		// not using omit true because we may want to set dateFinished to undefined
		// when isFinished is set to false
		const updatedProject = await Project.findByIdAndUpdate(
			id,
			{
				description: description ? description : project.description,
				isFinished: isFinished ? isFinished : project.isFinished,
				dateUpdated: new Date(moment().format()),
				dateFinished: isFinished
					? new Date(moment().format())
					: undefined,
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
