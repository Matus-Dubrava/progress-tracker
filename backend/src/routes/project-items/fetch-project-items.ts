import { Router, Request, Response } from 'express';

const router = Router();

router.get(`/projects/:projectId/items`, (req: Request, res: Response) => {
	return res.send('items');
});

export { router as fetchProjectItemsRouter };
