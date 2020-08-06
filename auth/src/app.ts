import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import 'express-async-errors';

import { signupRouter } from './routes/signup';

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

export { app };
