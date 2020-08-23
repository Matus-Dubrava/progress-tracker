import { CommentDocument } from '../models/comment';

export interface SerializedComment {
	text: string;
	id: string;
	dateCreated: Date;
}

export const serializeComment = (
	comment: CommentDocument
): SerializedComment => {
	return {
		text: comment.text,
		id: comment._id,
		dateCreated: comment.dateCreated,
	};
};
