import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middleware/validate-request';
import { serializeUser } from '../services/serialize-user';
import { User } from '../models/user';
import { AuthenticationError } from '../errors/authentication-error';
import { EmailTakenSignupError } from '../errors/email-taken-signup-error';

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
	async (req: Request, res: Response) => {
		const { email, name, password } = req.body;

		// check whether given email is not taken
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new EmailTakenSignupError(
				`ERROR [email-taken-signup-error] address ${email} already in use`
			);
		}

		// create new user and store it in db
		const user = User.build({ email, name, password });
		await user.save();

		// create JWS and cookie and respond
		return res.status(201).send(serializeUser(user));
	}
);

export { router as signupRouter };
