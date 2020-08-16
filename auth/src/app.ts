import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/signout';
import { NotFoundError } from './errors/not-found-error';
import { handleError } from './middleware/handle-error';

const loggingFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level} ${message}`;
});

export const logger = createLogger({
	defaultMeta: {
		service: 'auth-service',
	},
	format: combine(timestamp(), loggingFormat),
	transports: [new transports.Console()],
});

const app = express();
const authBaseUrlPath = `/api/${process.env.API_VERSION}/auth`;

app.use(json());
app.use(cors());
app.use(
	cookieSession({
		name: 'session',
		keys: [process.env.COOKIE_KEY!],
		httpOnly: true,
	})
);

app.use((req, res, next) => {
	const { method, url } = req;
	logger.info(`REQUEST: ${method} ${url}`);
	next();
});

app.use(authBaseUrlPath, signupRouter);
app.use(authBaseUrlPath, signinRouter);
app.use(authBaseUrlPath, currentUserRouter);
app.use(authBaseUrlPath, signoutRouter);

// health check route
app.get(`${authBaseUrlPath}/health`, (req, res) => {
	return res.sendStatus(200);
});

// catch all middleware
app.use('*', (req, res) => {
	const { url, method } = req;
	throw new NotFoundError(`Resource: ${method} ${url} not found`);
});

app.use(handleError);

export { app };
