import { ProjectItemCategory } from '../../../models/project-item';

const config = {
	testTitle: 'test title',
	testDescription: 'test description',
	categoryTask: ProjectItemCategory.Task,
	categoryIssue: ProjectItemCategory.Issue,
	invalidCategoryType: 'something else',
	commentText: 'comment text which is at least 15 characters long',
	invalidCommentText: 'too short',
};

export { config };
