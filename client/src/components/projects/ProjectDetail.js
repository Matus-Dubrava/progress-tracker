import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
	fetchProject,
	updateProject,
	deleteProject,
	fetchProjectItems,
} from '../../actions';
import { parseDateTime } from '../../helpers/parse-date-time';
import ProjectDetailTable from './ProjectDetailTable';

const ProjectDetail = ({
	project,
	updateProject,
	fetchProject,
	deleteProject,
	fetchProjectItems,
	projectItems,
	match: {
		params: { id: projectId },
	},
}) => {
	useEffect(() => {
		fetchProject(projectId);
	}, []);

	useEffect(() => {
		fetchProjectItems({ projectId });
	}, []);

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

	if (!project) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<div className="project-card content-box" key={project.id}>
				<h3>{project.name}</h3>
				<p>{project.description}</p>
				<small>
					date created: {parseDateTime(project.dateCreated)}
				</small>
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
				<small>
					finished status: {project.isFinished ? 'Closed' : 'Open'}
				</small>
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
					onClick={() => deleteProject(project.id)}
					className="btn btn-outline-danger ml-2"
				>
					Delete
				</button>
			</div>
			<ProjectDetailTable items={projectItems} projectId={projectId} />
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
		projectItems: Object.values(state.projectItems),
	};
};

export default connect(mapStateToProps, {
	fetchProject,
	deleteProject,
	updateProject,
	fetchProjectItems,
})(ProjectDetail);
