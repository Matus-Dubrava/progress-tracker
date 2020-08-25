import React from 'react';
import { connect } from 'react-redux';

import './ProjectItemComment.css';
import { deleteComment } from '../../actions';
import { parseDateTime } from '../../helpers/parse-date-time';

const ProjectItemComment = ({
	text,
	dateCreated,
	projectId,
	itemId,
	commentId,
	deleteComment,
}) => {
	return (
		<div className="project-item-comment-wrapper">
			<div className="project-item-comment-date">
				submitted at: {parseDateTime(dateCreated)}
			</div>
			<div className="project-item-comment-body">{text}</div>
			<button
				onClick={() =>
					deleteComment({
						projectId,
						itemId,
						commentId,
					})
				}
			>
				Delete
			</button>
		</div>
	);
};

export default connect(null, { deleteComment })(ProjectItemComment);
