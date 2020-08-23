import mongoose, { Schema } from 'mongoose';

import { Comment, CommentDocument } from './comment';

interface ProjectItemAttrs {
	projectId: string;
	title: string;
	description: string;
	category: string;
}

interface ProjectItemModel extends mongoose.Model<ProjectItemDocument> {
	build(attrs: ProjectItemAttrs): ProjectItemDocument;
}

export interface ProjectItemDocument extends mongoose.Document {
	projectId: string;
	title: string;
	description: string;
	dateCreated: Date;
	dateUpdated: Date;
	dateFinished: Date;
	isFinished: boolean;
	category: string;
	comments: CommentDocument[];
}

const projectItemSchema = new mongoose.Schema({
	projectId: { type: Schema.Types.ObjectId },
	title: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now, required: true },
	dateUpdated: { type: Date, default: Date.now, required: true },
	dateFinished: { type: Date, required: false },
	isFinished: { type: Boolean, default: false, required: true },
	category: { type: String, required: true },
	comments: [],
});

projectItemSchema.statics.build = (attrs: ProjectItemAttrs) => {
	return new ProjectItem(attrs);
};

const ProjectItem = mongoose.model<ProjectItemDocument, ProjectItemModel>(
	'ProjectItem',
	projectItemSchema
);

export { ProjectItem };
