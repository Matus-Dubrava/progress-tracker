import { ProjectItemCategory } from '../../../models/project-item';

const config = {
	testTitle: 'test title',
	testDescription: 'test description',
	categoryTask: ProjectItemCategory.Task,
	categoryIssue: ProjectItemCategory.Issue,
	invalidCategoryType: 'something else',
	commentText1: 'comment text which is at least 15 characters long 1',
	commentText2: 'comment text which is at least 15 characters long 2',
	invalidCommentText: 'too short',
};

export { config };
