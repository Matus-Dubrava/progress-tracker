import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './ProjectDetailHeader.css';
import { parseDateTime } from '../../helpers/parse-date-time';
import { deleteProject, updateProject } from '../../actions';

const ProjectDetailHeader = ({ deleteProject, updateProject, project }) => {
	const renderUpdateButton = ({ id, isFinished }) => {
		if (isFinished) {
			return (
				<button
					onClick={() => {
						updateProject({ id, isFinished: false });
					}}
					className="btn btn-outline-success ml-2"
				>
					Reopen
				</button>
			);
		} else {
			return (
				<button
					onClick={() => {
						updateProject({ id, isFinished: true });
					}}
					className="btn btn-outline-success ml-2"
				>
					Close
				</button>
			);
		}
	};

	return (
		<div className="project-card content-box" key={project.id}>
			<div className="project-header">
				<h3>{project.name}</h3>
				<div
					className={`status status-${
						project.isFinished ? 'closed' : 'open'
					}`}
				>
					{project.isFinished ? 'closed' : 'in progress'}
				</div>
			</div>
			<p>{project.description}</p>
			<small>date created: {parseDateTime(project.dateCreated)}</small>
			<br />
			<small>last updated:{parseDateTime(project.dateUpdated)}</small>
			<br />
			{project.isFinished && (
				<>
					<small>
						date finished: {parseDateTime(project.dateFinished)}
					</small>
					<br />
				</>
			)}
			<br />
			<Link
				to={`/projects/${project.id}/items/create?category=task`}
				className="btn btn-outline-info ml-2"
			>
				New Task
			</Link>
			<Link
				to={`/projects/${project.id}/items/create?category=issue`}
				className="btn btn-outline-warning ml-2"
			>
				New Issue
			</Link>
			{renderUpdateButton(project)}
			<button
				onClick={() => alert('Deleting projects is disabled for now')}
				// onClick={() => deleteProject(project.id)}
				className="btn btn-outline-danger ml-2"
			>
				Delete
			</button>
		</div>
	);
};

export default connect(null, { deleteProject, updateProject })(
	ProjectDetailHeader
);
