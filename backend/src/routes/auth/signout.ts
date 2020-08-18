import { Router, Request, Response } from 'express';

const router = Router();

router.get(`/signout`, (req: Request, res: Response) => {
	// nullify session object
	req.session = null;
	return res.send({});
});

export { router as signoutRouter };
