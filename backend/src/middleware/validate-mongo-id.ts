import { Request, Response, NextFunction } from 'express';

import { CustomRequestValidationError } from '../errors/custom-request-validation-error';

export const validateMongoId = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { projectId } = req.params;

	if (projectId.length !== 24) {
		throw new CustomRequestValidationError(
			'incorrect project ID format, expected 24 characters long hex string'
		);
	}

	next();
};
