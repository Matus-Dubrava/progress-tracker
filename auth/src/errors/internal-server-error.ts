import { CustomError } from './custom-error';

export class InternalServerError extends CustomError {
	statusCode = 500;

	constructor() {
		super('500 internal server error');
		Object.setPrototypeOf(this, InternalServerError.prototype);
	}

	serializeError = () => [
		{
			message: '500 internal server error',
		},
	];
}
