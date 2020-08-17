import axios from 'axios';

const API_VERSION = 'v1';

export default axios.create({
	baseURL: `http://localhost:5000/api/${API_VERSION}/auth/`,
});
