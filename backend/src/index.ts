import mongoose from 'mongoose';

import { app } from './app';
import { logger } from './app';

const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;
const MONGO_URI = process.env.MONGO_URI;

if (!PORT) {
	throw new Error('PORT is not set');
}

if (!API_VERSION) {
	throw new Error('API_VERSION is not set');
}

if (!MONGO_URI) {
	throw new Error('MONGO_URI is not set');
}

if (!process.env.JWT_KEY) {
	throw new Error('JWT_KEY is not set');
}

if (!process.env.COOKIE_KEY) {
	throw new Error('COOKIE_KEY is not set');
}

app.listen(PORT, async () => {
	try {
		await mongoose.connect(`${MONGO_URI}/users`, {
			useUnifiedTopology: true,
			useCreateIndex: true,
			useNewUrlParser: true,
		});
		logger.info('successfully connected to database');
	} catch (err) {
		logger.error('failed to connect to database');
		throw new Error('failed to connect to database');
	}

	logger.info(`auth service listening on port ${PORT}`);
});
