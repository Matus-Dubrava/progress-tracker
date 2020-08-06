import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import 'express-async-errors';

import { signupRouter } from './routes/signup';
import { NotFoundError } from './errors/not-found-error';
import { InternalServerError } from './errors/internal-server-error';
import { CustomError } from './errors/custom-error';

const app = express();
const API_VERSION = process.env.API_VERSION;

if (!API_VERSION) {
	throw new Error('API_VERSION is not set');
}

app.use(json());
app.use(cors());

app.use(signupRouter);

// health check route
app.get(`/api/${API_VERSION}/auth/health`, (req, res) => {
	return res.sendStatus(200);
});

// catch all middleware
app.use('*', (req, res) => {
	const { url, method } = req;
	throw new NotFoundError(`Resource: ${method} ${url} not found`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	// check whether the error was thrown intentionally
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send(err.serializeError());
	}

	// This was unexpected error, not thrown by us
	const internalError = new InternalServerError();
	return res
		.status(internalError.statusCode)
		.send(internalError.serializeError());
});

export { app };
