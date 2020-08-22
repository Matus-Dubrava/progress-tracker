import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchProjects, deleteProject, updateProject } from '../../actions';
import './ProjectList.css';

const ProjectList = ({
	projects,
	fetchProjects,
	deleteProject,
	updateProject,
}) => {
	useEffect(() => {
		fetchProjects();
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

	const renderedProjects = projects.map((project) => {
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
				<Link
					className="btn btn-primary ml-2"
					to={`/projects/${project.id}`}
				>
					View
				</Link>
				<button
					onClick={() => deleteProject(project.id)}
					className="btn btn-danger ml-2"
				>
					Delete
				</button>
			</div>
		);
	});

	return (
		<div>
			<h1>ProjectList</h1>
			<Link to="/projects/create" className="btn btn-primary mb-2">
				Create Project
			</Link>
			<div className="project-list">{renderedProjects}</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		projects: Object.values(state.projects),
	};
};

export default connect(mapStateToProps, {
	fetchProjects,
	deleteProject,
	updateProject,
})(ProjectList);
