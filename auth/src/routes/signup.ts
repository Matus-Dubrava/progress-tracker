import { Router } from 'express';

const router = Router();
const API_VERSION = process.env.API_VERSION;

router.post(`/api/${API_VERSION}/auth/signup`, (req, res) => {
	return res.send('signup route...');
});

export { router as signupRouter };
