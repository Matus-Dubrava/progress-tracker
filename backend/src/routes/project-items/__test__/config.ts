import { ProjectItemCategory } from '../../../models/project-item';

const config = {
	testTitle: 'test title',
	testDescription: 'test description',
	categoryTask: ProjectItemCategory.Task,
	categoryIssue: ProjectItemCategory.Issue,
	invalidCategoryType: 'something else',
};

export { config };
