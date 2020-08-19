import { CustomError } from './custom-error';

export class CustomRequestValidationError extends CustomError {
	statusCode = 422;

	constructor(public message: string) {
		super(message);
		Object.setPrototypeOf(this, CustomRequestValidationError.prototype);
	}

	serializeError = () => {
		return [{ message: this.message }];
	};
}
