import { app } from './app';

const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;

if (!PORT) {
	throw new Error('PORT is not set');
}

if (!API_VERSION) {
	throw new Error('API_VERSION is not set');
}

app.listen(PORT, () => {
	console.log(`auth service listening on port ${PORT}`);
});
