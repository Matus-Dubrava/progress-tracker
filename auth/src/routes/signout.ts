import { Router, Request, Response } from 'express';

const router = Router();
const API_VERSION = process.env.API_VERSION;

router.get(
	`/api/${API_VERSION}/auth/signout`,
	(req: Request, res: Response) => {
		// nullify session object
		req.session = null;
		return res.send({});
	}
);

export { router as signoutRouter };
