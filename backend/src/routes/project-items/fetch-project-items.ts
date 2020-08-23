import { Router, Request, Response } from 'express';

import { requireAuth } from '../../middleware/require-auth';
import { currentUser } from '../../middleware/current-user';
import { validateMongoId } from '../../middleware/validate-mongo-id';
import {
	ProjectItem,
	ProjectItemCategory,
	ProjectItemDocument,
} from '../../models/project-item';
import { Project } from '../../models/project';
import { CustomRequestValidationError } from '../../errors/custom-request-validation-error';
import { NotFoundError } from '../../errors/not-found-error';
import { serializeProjectItem } from '../../services/serialize-project-item';

const router = Router();

router.get(
	`/projects/:projectId/items`,
	currentUser,
	requireAuth,
	validateMongoId,
	async (req: Request, res: Response) => {
		const { projectId } = req.params;
		const { category } = req.query;

		// category should be either undefined or one of the valid ones
		if (
			category !== ProjectItemCategory.Issue &&
			category !== ProjectItemCategory.Task &&
			category !== undefined
		) {
			throw new CustomRequestValidationError(
				`invalid category, expected ${ProjectItemCategory.Issue} or ${ProjectItemCategory.Task}`
			);
		}

		// project owner's ID must match the current user's ID
		const project = await Project.findById(projectId);

		if (!project) {
			throw new NotFoundError(
				`Project with ID ${projectId} does not exist`
			);
		}

		// don't pass category to search criteria if it is undefined
		let projectItems: ProjectItemDocument[];
		if (category) {
			projectItems = await ProjectItem.find({ category, projectId });
		} else {
			projectItems = await ProjectItem.find({ projectId });
		}

		return res.send(projectItems.map(serializeProjectItem));
	}
);

export { router as fetchProjectItemsRouter };
