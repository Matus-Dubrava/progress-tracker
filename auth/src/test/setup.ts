import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'jwttestkey12345';
	process.env.COOKIE_KEY = 'cookietestkey12345';

	mongo = new MongoMemoryServer();
	const mongoURI = await mongo.getUri();

	await mongoose.connect(mongoURI, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

// delete every collection before each test
beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

// stop mongo memory server and close mongoose connection
// all test are done
afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});
