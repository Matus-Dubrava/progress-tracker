const API_VERSION = process.env.API_VERSION;

const config = {
	baseProjectUrl: `/api/${API_VERSION}/projects`,
	testProjectName: 'test name',
	testProjectDescription: 'test description',
};

export { config };
