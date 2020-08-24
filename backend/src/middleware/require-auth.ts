import { Request, Response, NextFunction } from 'express';

import { RequestUnathorizedError } from '../errors/request-unauthorized-error';

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.currentUser) {
		throw new RequestUnathorizedError();
	}

	next();
};
