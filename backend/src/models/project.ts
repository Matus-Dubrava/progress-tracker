import mongoose, { Schema } from 'mongoose';

interface ProjectAttrs {
	ownerId: string;
	name: string;
	description: string;
}

interface ProjectModel extends mongoose.Model<ProjectDocument> {
	build(attrs: ProjectAttrs): ProjectDocument;
}

export interface ProjectDocument extends mongoose.Document {
	ownerId: string;
	name: string;
	description: string;
	dateCreated: Date;
	dateUpdated: Date;
	dateFinished: Date;
	isFinished: boolean;
}

const projectSchema = new mongoose.Schema({
	ownerId: { type: Schema.Types.ObjectId },
	name: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now, required: true },
	dateUpdated: { type: Date, default: Date.now, required: true },
	dateFinished: { type: Date, required: false },
	isFinished: { type: Boolean, default: false, require: true },
	// TODO: tasks associated with the project
});

projectSchema.statics.build = (attrs: ProjectAttrs) => {
	return new Project(attrs);
};

const Project = mongoose.model<ProjectDocument, ProjectModel>(
	'Project',
	projectSchema
);

export { Project };
