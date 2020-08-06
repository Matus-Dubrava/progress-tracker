import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';
import { InternalServerError } from '../errors/internal-server-error';

export const handleError = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log(err.message);

	// check whether the error was thrown intentionally
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send(err.serializeError());
	}

	// This was unexpected error, not thrown by us
	const internalError = new InternalServerError();
	return res
		.status(internalError.statusCode)
		.send(internalError.serializeError());
};
