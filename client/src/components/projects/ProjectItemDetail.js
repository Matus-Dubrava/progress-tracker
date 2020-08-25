import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
	fetchProjectItem,
	updateProjectItemStatus,
	deleteProjectItem,
} from '../../actions';
import { parseDateTime } from '../../helpers/parse-date-time';
import ProjectItemComment from './ProjectItemComment';

const ProjectItemDetail = ({
	match,
	fetchProjectItem,
	updateProjectItemStatus,
	deleteProjectItem,
	item,
}) => {
	const projectId = match.params.id;
	const itemId = match.params.itemId;

	useEffect(() => {
		fetchProjectItem({ projectId, itemId });
	}, []);

	let renderedComments;
	let renderedOpenCloseButton;

	if (!item) {
		return <div>Loading...</div>;
	} else {
		renderedComments = item.comments.map((comment) => {
			return (
				<ProjectItemComment
					key={comment.id}
					text={comment.text}
					dateCreated={comment.dateCreated}
					projectId={projectId}
					itemId={itemId}
					commentId={comment.id}
				/>
			);
		});

		renderedOpenCloseButton = (
			<button
				onClick={() =>
					updateProjectItemStatus({
						projectId,
						itemId: item.id,
						isFinished: !item.isFinished,
					})
				}
			>
				{item.isFinished ? 'Reopen' : 'Close'}
			</button>
		);
	}

	return (
		<div>
			<div className="project-card content-box" key={item.id}>
				<h3>{item.title}</h3>
				<p>{item.description}</p>
				<small>date created: {parseDateTime(item.dateCreated)}</small>
				<br />
				<small>last updated:{parseDateTime(item.dateUpdated)}</small>
				<br />
				{item.isFinished && (
					<>
						<small>
							date finished: {parseDateTime(item.dateFinished)}
						</small>
						<br />
					</>
				)}
				<small>
					finished status: {item.isFinished ? 'Closed' : 'Open'}
				</small>
				<br />
				{renderedOpenCloseButton}
				<Link
					className="btn btn-outline-primary"
					to={`/projects/${projectId}/items/${itemId}/comments/create`}
				>
					add comment
				</Link>
				<button
					onClick={() => deleteProjectItem({ projectId, itemId })}
				>
					delete
				</button>
			</div>
			<ul style={{ padding: '0' }}>{renderedComments}</ul>
		</div>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		item: state.projectItems[ownProps.match.params.itemId],
	};
};

export default connect(mapStateToProps, {
	fetchProjectItem,
	updateProjectItemStatus,
	deleteProjectItem,
})(ProjectItemDetail);
