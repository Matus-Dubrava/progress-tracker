import { Router, Request, Response, NextFunction } from 'express';

import { currentUser } from '../middleware/current-user';

const router = Router();

router.get(
	`/current-user`,
	currentUser,
	(req: Request, res: Response, next: NextFunction) => {
		return res.send({ currentUser: req.currentUser || null });
	}
);

export { router as currentUserRouter };
