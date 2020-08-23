import { Router, Request, Response } from 'express';

import { currentUser } from '../../middleware/current-user';
import { requireAuth } from '../../middleware/require-auth';
import { Project } from '../../models/project';

const router = Router();

router.get(
	'/projects/summary',
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const ownerId = req.currentUser!.id;

		const activeProjectsCount = await Project.find({
			ownerId,
			isFinished: false,
		}).count();
		const finishedProjectsCount = await Project.find({
			ownerId,
			isFinished: true,
		}).count();
		const totalProjectsCount = activeProjectsCount + finishedProjectsCount;

		return res.send({
			activeProjectsCount,
			finishedProjectsCount,
			totalProjectsCount,
		});
	}
);

export { router as fetchProjectsSummaryRouter };
