import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
	fetchProjectItem,
	updateProjectItemStatus,
	deleteProjectItem,
} from '../../actions';

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
				<li
					style={{
						marginTop: '5px',
						display: 'flex',
						border: '1px solid #ddd',
						alignItems: 'center',
						padding: '0.5rem',
					}}
					key={comment.id}
				>
					<p>{comment.text}</p>
					<p>{comment.dateCreated}</p>
				</li>
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
			<div className="project-card" key={item.id}>
				<h3>{item.title}</h3>
				<p>{item.description}</p>
				<small>date created: {item.dateCreated}</small>
				<br />
				<small>last updated:{item.dateUpdated}</small>
				<br />
				{item.isFinished && (
					<>
						<small>date finished: {item.dateFinished}</small>
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
