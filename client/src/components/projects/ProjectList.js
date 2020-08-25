import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './ProjectList.css';
import { fetchProjects, deleteProject, updateProject } from '../../actions';
import { parseDateTime } from '../../helpers/parse-date-time';

const ProjectList = ({ projects, fetchProjects }) => {
	useEffect(() => {
		fetchProjects();
	}, []);

	const renderedProjects = projects.map((project) => {
		return (
			<tr key={project.id}>
				<td>
					<Link to={`/projects/${project.id}`}>{project.name}</Link>
				</td>
				<td>
					<span
						className={`category category-${
							project.isFinished ? 'closed' : 'open'
						}`}
					>
						{project.isFinished ? 'closed' : 'open'}
					</span>
				</td>
				<td>{parseDateTime(project.dateCreated)}</td>
				<td>{parseDateTime(project.dateUpdated)}</td>
				<td>
					{project.dateFinished &&
						parseDateTime(project.dateFinished)}
				</td>
			</tr>
		);
	});

	return (
		<div>
			<h1>Projects</h1>
			<Link to="/projects/create" className="btn btn-primary mb-2">
				Create Project
			</Link>
			<table className="project-detail-table content-box">
				<thead>
					<tr>
						<td>Title</td>
						<td>Status</td>
						<td>Created At</td>
						<td>Last Update At</td>
						<td>Closed At</td>
					</tr>
				</thead>
				<tbody>{renderedProjects}</tbody>
			</table>
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
