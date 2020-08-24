import { CustomError } from './custom-error';

export class RequestForbiddenError extends CustomError {
	statusCode = 403;

	constructor(public message: string) {
		super(message);
		Object.setPrototypeOf(this, RequestForbiddenError.prototype);
	}

	serializeError() {
		return [
			{
				message: this.message,
			},
		];
	}
}
