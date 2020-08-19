import { Request, Response, NextFunction } from 'express';

import { ForbiddenResourceError } from '../errors/forbidden-resource-error';

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.currentUser) {
		throw new ForbiddenResourceError();
	}

	next();
};
