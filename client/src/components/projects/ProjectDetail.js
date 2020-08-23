import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchProject, updateProject, deleteProject } from '../../actions';

const ProjectDetail = ({
	project,
	updateProject,
	fetchProject,
	deleteProject,
	match: {
		params: { id },
	},
}) => {
	useEffect(() => {
		fetchProject(id);
	}, []);

	const renderUpdateButton = ({ id, isFinished }) => {
		if (isFinished) {
			return (
				<button
					onClick={() => {
						updateProject({ id, isFinished: false });
					}}
					className="btn btn-success ml-2"
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
					className="btn btn-success ml-2"
				>
					Close
				</button>
			);
		}
	};

	if (!project) {
		return <div>Loading...</div>;
	}

	return (
		<div className="project-card" key={project.id}>
			<h3>{project.name}</h3>
			<p>{project.description}</p>
			<small>date created: {project.dateCreated}</small>
			<br />
			<small>last updated:{project.dateUpdated}</small>
			<br />
			{project.isFinished && (
				<>
					<small>date finished: {project.dateFinished}</small>
					<br />
				</>
			)}
			<small>
				finished status: {project.isFinished ? 'Closed' : 'Open'}
			</small>
			<br />
			{renderUpdateButton(project)}
			<button
				onClick={() => deleteProject(project.id)}
				className="btn btn-danger ml-2"
			>
				Delete
			</button>
		</div>
	);
};

const mapStateToProps = (
	state,
	{
		match: {
			params: { id },
		},
	}
) => {
	return {
		project: state.projects[id],
	};
};

export default connect(mapStateToProps, {
	fetchProject,
	deleteProject,
	updateProject,
})(ProjectDetail);
