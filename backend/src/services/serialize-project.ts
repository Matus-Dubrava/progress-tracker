import { ProjectDocument } from '../models/project';

interface SerializedProject {
	name: string;
	id: string;
	isFinished: boolean;
	description: string;
	ownerId: string;
	dateCreated: Date;
	dateUpdated: Date;
	dateFinished?: Date;
}

export const serializeProject = (
	project: ProjectDocument
): SerializedProject => {
	return {
		name: project.name,
		id: project._id,
		isFinished: project.isFinished,
		description: project.description,
		ownerId: project.ownerId,
		dateCreated: project.dateCreated,
		dateUpdated: project.dateUpdated,
		dateFinished: project.dateFinished,
	};
};
