const API_VERSION = process.env.API_VERSION;

const config = {
	signoutGetUrl: `/api/${API_VERSION}/auth/signout`,
	signupPostUrl: `/api/${API_VERSION}/auth/signup`,
	currentUserGetUrl: `/api/${API_VERSION}/auth/current-user`,
	signinPostUrl: `/api/${API_VERSION}/auth/signin`,
	baseAuthUrl: `/api/${API_VERSION}/auth`,

	testEmail: 'test@test.com',
	testEmail2: 'adming@test.com',
	testPassword: 'testpassword12345',
	testName: 'testname',
	invalidTestEmail: '12345',
	invalidTestPassword: '12345',
};

export { config };
