import { CustomError } from './custom-error';

export class ForbiddenResourceError extends CustomError {
	statusCode = 403;

	constructor() {
		super('requested forbidden route');
		Object.setPrototypeOf(this, ForbiddenResourceError.prototype);
	}

	serializeError() {
		return [
			{
				message: 'requested forbidden route',
			},
		];
	}
}
