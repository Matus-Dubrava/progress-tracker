import axios from 'axios';

const API_VERSION = 'v1';

export default axios.create({
	baseURL: `https://progresstracker.cloud/api/${API_VERSION}/auth/`,
});
