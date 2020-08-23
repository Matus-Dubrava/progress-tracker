import { Router, Request, Response } from 'express';

const router = Router();

router.post(
	`/projects/:projectId/items/:itemId/comments`,
	async (req: Request, res: Response) => {
		return res.send('comment added');
	}
);

export { router as projectItemCreateComment };
