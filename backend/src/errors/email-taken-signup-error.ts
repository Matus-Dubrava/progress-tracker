import { CustomError } from './custom-error';

export class EmailTakenSignupError extends CustomError {
	statusCode = 422;

	constructor(public message: string) {
		super(message);
		Object.setPrototypeOf(this, EmailTakenSignupError.prototype);
	}

	serializeError = () => [
		{
			message: 'email address is already in use',
		},
	];
}
