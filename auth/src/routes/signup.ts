import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middleware/validate-request';
import { serializeUser } from '../services/serialize-user';
import { User } from '../models/user';
import { EmailTakenSignupError } from '../errors/email-taken-signup-error';

const router = Router();

router.post(
	`/signup`,
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
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};
		return res.status(201).send(serializeUser(user));
	}
);

export { router as signupRouter };
