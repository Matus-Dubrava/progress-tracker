import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
	email: string;
	id: string;
}

// ensuret that Typescript knows about currentUser property on Request object
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

const currentUser = (req: Request, res: Response, next: NextFunction) => {
	// if there is no JWT, continue without setting currentUser
	if (!req.session?.jwt) {
		return next();
	}

	// extract JWT payload from request and set curretUser property
	try {
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;

		req.currentUser = {
			email: payload.email,
			id: payload.id,
		};
	} catch (err) {
		throw err;
	}

	return next();
};

export { currentUser };
