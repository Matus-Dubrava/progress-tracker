import { CustomError } from './custom-error';

export class AuthenticationError extends CustomError {
	statusCode = 422;

	constructor(public message: string) {
		super(message);
		Object.setPrototypeOf(this, AuthenticationError.prototype);
	}

	serializeError = () => [
		{
			message: 'incorrect login credentials',
		},
	];
}
