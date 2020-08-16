import { CustomError } from './custom-error';

export class AuthenticationError extends CustomError {
	statusCode = 422;

	constructor() {
		super('incorrect login credentials');
		Object.setPrototypeOf(this, AuthenticationError.prototype);
	}

	serializeError = () => [
		{
			message: 'incorrect login credentials',
		},
	];
}
