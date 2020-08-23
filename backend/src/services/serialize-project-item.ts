import { ProjectItemDocument } from '../models/project-item';
import { CommentDocument } from '../models/comment';

interface SerializedProjectItem {
	projectId: string;
	title: string;
	id: string;
	isFinished: boolean;
	description: string;
	dateCreated: Date;
	dateUpdated: Date;
	dateFinished?: Date;
	category: string;
	comments: CommentDocument[];
}

export const serializeProjectItem = (
	projectItem: ProjectItemDocument
): SerializedProjectItem => {
	return {
		projectId: projectItem.projectId,
		title: projectItem.title,
		id: projectItem._id,
		isFinished: projectItem.isFinished,
		description: projectItem.description,
		dateCreated: projectItem.dateCreated,
		dateUpdated: projectItem.dateUpdated,
		dateFinished: projectItem.dateFinished,
		category: projectItem.category,
		comments: projectItem.comments,
	};
};
