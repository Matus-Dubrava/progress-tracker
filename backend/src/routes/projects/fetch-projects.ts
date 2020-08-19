import { Router, Request, Response } from 'express';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { Project } from '../../models/project';
import { serializeProject } from '../../services/serialize-project';

const router = Router();

router.get(
	'/projects',
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const userId = req.currentUser!.id;

		// return projects sorted by date created (from newest to oldest)
		const projects = await Project.find({
			ownerId: userId,
		}).sort({ dateCreated: -1 });

		return res.send(projects.map(serializeProject));
	}
);

export { router as fetchProjectsRouter };
