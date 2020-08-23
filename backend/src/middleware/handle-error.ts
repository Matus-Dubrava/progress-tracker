import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';
import { InternalServerError } from '../errors/internal-server-error';
import { logger } from '../app';

export const handleError = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// check whether the error was thrown intentionally
	if (err instanceof CustomError) {
		logger.warn(err.message);
		return res.status(err.statusCode).send(err.serializeError());
	}

	// This was unexpected error, not thrown by us
	const internalError = new InternalServerError();
	logger.error(internalError.message);
	return res
		.status(internalError.statusCode)
		.send(internalError.serializeError());
};
