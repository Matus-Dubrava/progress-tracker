import mongoose from 'mongoose';

interface CommentAttrs {
	text: string;
}

interface Comment extends mongoose.Model<CommentDocument> {
	build(attrs: CommentAttrs): CommentDocument;
}

export interface CommentDocument extends mongoose.Document {
	text: string;
	dateCreated: Date;
}

const commentSchema = new mongoose.Schema({
	text: { type: String, required: true },
	dateCreated: { type: Date, default: Date.now, required: true },
});

commentSchema.statics.build = (attrs: CommentAttrs) => {
	return new Comment(attrs);
};

const Comment = mongoose.model<CommentDocument, Comment>(
	'Comment',
	commentSchema
);

export { Comment };
