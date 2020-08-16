import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { currentUserRouter } from './routes/current-user';
import { NotFoundError } from './errors/not-found-error';
import { handleError } from './middleware/handle-error';

const app = express();
const API_VERSION = process.env.API_VERSION;

app.use(json());
app.use(cors());
app.use(
	cookieSession({
		name: 'session',
		keys: ['12345'],
	})
);

app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);

// health check route
app.get(`/api/${API_VERSION}/auth/health`, (req, res) => {
	return res.sendStatus(200);
});

// catch all middleware
app.use('*', (req, res) => {
	const { url, method } = req;
	throw new NotFoundError(`Resource: ${method} ${url} not found`);
});

app.use(handleError);

export { app };
