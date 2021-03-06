const API_VERSION = process.env.API_VERSION;

const config = {
	baseProjectUrl: `/api/${API_VERSION}/projects`,
	testProjectName1: 'test name 1',
	testProjectName2: 'test name 2',
	testProjectName3: 'test name 3',
	testProjectDescription: 'test description',
	testProjectDescriptionUpdated: 'this is updated description',
	testProjectId: '5f3d5a6a5aa86a1250e113ea',
	testProjectInvalidId: '12',
};

export { config };
