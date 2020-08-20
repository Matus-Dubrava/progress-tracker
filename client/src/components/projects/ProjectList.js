import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchProjects } from '../../actions';

const ProjectList = ({ projects, fetchProjects }) => {
	useEffect(() => {
		fetchProjects();
	}, []);

	const renderedProjects = projects.map((project) => {
		return (
			<div key={project.id}>
				<h3>{project.name}</h3>
				<p>{project.description}</p>
				<small>date created: {project.dateCreated}</small>
				<br />
				<small>last updated:{project.dateUpdated}</small>
				<br />
				<small>date finished: {project.dateFinished}</small>
				<br />
				<small>finished status: {project.isFinished}</small>
				<br />
			</div>
		);
	});

	return (
		<div>
			<h1>ProjectList</h1>
			<ul className="card">{renderedProjects}</ul>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		projects: state.projects,
	};
};

export default connect(mapStateToProps, { fetchProjects })(ProjectList);
