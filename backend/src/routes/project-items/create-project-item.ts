import { Router, Request, Response } from 'express';

const router = Router();

router.post('/projects/:project_id', (req: Request, res: Response) => {
	return res.send('item created');
});

export { router as createProjectItemRouter };
