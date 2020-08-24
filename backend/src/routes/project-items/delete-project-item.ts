import { Router, Request, Response } from 'express';

const router = Router();

router.delete(
	'/projects/:projectId/items/:itemId',
	(req: Request, res: Response) => {
		return res.sendStatus(204);
	}
);

export { router as deleteProjectItemRouter };
