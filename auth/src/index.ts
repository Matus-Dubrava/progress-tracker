import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import 'express-async-errors';

const app = express();
const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;

if (!PORT) {
	throw new Error('PORT is not set');
}

if (!API_VERSION) {
	throw new Error('API_VERSION is not set');
}

app.use(json());
app.use(cors());

app.get(`/api/${API_VERSION}/auth/health`, (req, res) => {
	return res.sendStatus(200);
});

app.listen(PORT, () => {
	console.log(`auth service listening on port ${PORT}`);
});
