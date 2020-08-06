import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middleware/validate-request';

const router = Router();
const API_VERSION = process.env.API_VERSION;

router.post(
	`/api/${API_VERSION}/auth/signup`,
	[
		body('email').isEmail().withMessage('incorrect or missing email'),
		body('name').notEmpty().withMessage('missing name'),
		body('password')
			.isLength({ min: 8 })
			.withMessage('password must be at least 8 characters long'),
	],
	validateRequest,
	(req: Request, res: Response) => {
		return res.send('signup route...');
	}
);

export { router as signupRouter };
