import axios from 'axios';

const API_VERSION = 'v1';

export default axios.create({
	baseURL: `http://auth/api/${API_VERSION}/`,
});
