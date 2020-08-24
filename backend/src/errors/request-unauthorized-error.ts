import { CustomError } from './custom-error';

export class RequestUnathorizedError extends CustomError {
	statusCode = 401;

	constructor() {
		super('You are not authorized to perform this action');
		Object.setPrototypeOf(this, RequestUnathorizedError.prototype);
	}

	serializeError() {
		return [
			{
				message: 'You are not authorized to perform this action',
			},
		];
	}
}
