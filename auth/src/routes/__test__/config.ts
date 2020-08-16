const API_VERSION = process.env.API_VERSION;

const config = {
	signoutGetUrl: `/api/${API_VERSION}/auth/signout`,
	signupPostUrl: `/api/${API_VERSION}/auth/signup`,

	testEmail: 'test@test.com',
	testPassword: 'testpassword12345',
	testName: 'testname',
	invalidTestEmail: '12345',
	invalidTestPassword: '12345',
};

export { config };
