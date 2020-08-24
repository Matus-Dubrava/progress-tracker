import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

import { signupRouter } from './routes/auth/signup';
import { signinRouter } from './routes/auth/signin';
import { currentUserRouter } from './routes/auth/current-user';
import { signoutRouter } from './routes/auth/signout';
import { deleteUserRouter } from './routes/auth/delete-user';

import { createProjectRouter } from './routes/projects/create-project';
import { fetchProjectsRouter } from './routes/projects/fetch-projects';
import { fetchProjectRouter } from './routes/projects/fetch-project';
import { deleteProjectRouter } from './routes/projects/delete-project';
import { updateProjectRouter } from './routes/projects/update-project';
import { fetchProjectsSummaryRouter } from './routes/projects/fetch-projects-summary';

import { createProjectItemRouter } from './routes/project-items/create-project-item';
import { fetchProjectItemsRouter } from './routes/project-items/fetch-project-items';
import { fetchProjectItemRouter } from './routes/project-items/fetch-project-item';
import { deleteProjectItemRouter } from './routes/project-items/delete-project-item';
import { projectItemCreateCommentRouter } from './routes/project-items/project-item-create-comment';
import { projectItemDeleteCommentRouter } from './routes/project-items/project-item-delete-comment';
import { projectItemUpdateCommentRouter } from './routes/project-items/project-item-update-comment';

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
});

if (process.env.NODE_ENV !== 'test') {
	logger.add(new transports.Console());
} else {
	// don't need winston logs in test environment, send it to /dev/null
	logger.add(new transports.File({ filename: '/dev/null' }));
}

const app = express();
const authBaseUrlPath = `/api/${process.env.API_VERSION}/auth`;
const projectBaseUrlPath = `/api/${process.env.API_VERSION}`;

// this app sits behind proxy
app.set('trust proxy', true);

app.use(json());
app.use(
	cookieSession({
		// keys: [process.env.COOKIE_KEY!],
		keys: ['12345'],
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'test',
		signed: process.env.NODE_ENV !== 'test',
	})
);

app.use((req, res, next) => {
	const { method, url } = req;
	logger.info(`REQUEST: ${method} ${url}`);
	next();
});

// auth routes
app.use(authBaseUrlPath, signupRouter);
app.use(authBaseUrlPath, signinRouter);
app.use(authBaseUrlPath, currentUserRouter);
app.use(authBaseUrlPath, signoutRouter);
app.use(authBaseUrlPath, deleteUserRouter);

// project item routes
app.use(projectBaseUrlPath, projectItemUpdateCommentRouter);
app.use(projectBaseUrlPath, projectItemDeleteCommentRouter);
app.use(projectBaseUrlPath, projectItemCreateCommentRouter);
app.use(projectBaseUrlPath, createProjectItemRouter);
app.use(projectBaseUrlPath, fetchProjectItemsRouter);
app.use(projectBaseUrlPath, fetchProjectItemRouter);
app.use(projectBaseUrlPath, deleteProjectItemRouter);

// project routes
app.use(projectBaseUrlPath, fetchProjectsSummaryRouter);
app.use(projectBaseUrlPath, createProjectRouter);
app.use(projectBaseUrlPath, fetchProjectsRouter);
app.use(projectBaseUrlPath, fetchProjectRouter);
app.use(projectBaseUrlPath, deleteProjectRouter);
app.use(projectBaseUrlPath, updateProjectRouter);

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
