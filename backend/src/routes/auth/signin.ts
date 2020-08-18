import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middleware/validate-request';
import { User } from '../../models/user';
import { AuthenticationError } from '../../errors/authentication-error';
import { PasswordManager } from '../../services/password-manager';
import { serializeUser } from '../../services/serialize-user';

const router = Router();

router.post(
	`/signin`,
	[
		body('email').isEmail().withMessage('incorrect or missing email'),
		body('password').notEmpty(),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// verify whether user with a given email address exists
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new AuthenticationError();
		}

		// check password
		const passwordMatch = await PasswordManager.compare(
			existingUser.password,
			password
		);

		if (!passwordMatch) {
			throw new AuthenticationError();
		}

		// return user + jwt
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
				name: existingUser.name,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};
		return res.send(serializeUser(existingUser));
	}
);

export { router as signinRouter };
