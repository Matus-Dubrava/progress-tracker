import mongoose from 'mongoose';

import { app } from './app';

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

app.listen(PORT, async () => {
	try {
		await mongoose.connect(`${MONGO_URI}/users`, {
			useUnifiedTopology: true,
			useCreateIndex: true,
			useNewUrlParser: true,
		});
		console.log('successfully connected to database');
	} catch (err) {
		throw new Error('ERROR: failed to connect to database');
	}

	console.log(`auth service listening on port ${PORT}`);
});
