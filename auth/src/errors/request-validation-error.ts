import { CustomError } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
	statusCode = 422;

	constructor(public errors: ValidationError[]) {
		super('ERROR: request body validation failed');
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeError = () => {
		return this.errors.map((err) => {
			return {
				message: err.msg,
				field: err.param,
			};
		});
	};
}
