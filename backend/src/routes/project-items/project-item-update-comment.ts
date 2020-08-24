import { Router, Request, Response } from 'express';

const router = Router();

router.post(
	'/projects/:projectId/items/:itemId/comments/:commentId',
	(req: Request, res: Response) => {
		return res.send('comment updated');
	}
);

export { router as projectItemUpdateCommentRouter };
