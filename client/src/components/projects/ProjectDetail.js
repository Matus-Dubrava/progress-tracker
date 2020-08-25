import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchProject, fetchProjectItems } from '../../actions';
import ProjectDetailTable from './ProjectDetailTable';
import ProjectDetailHeader from './ProjectDetailHeader';
import ProjectDashboard from './ProjectDashboard';

const ProjectDetail = ({
	project,
	fetchProject,
	fetchProjectItems,
	projectItems,
	match: {
		params: { id: projectId },
	},
}) => {
	useEffect(() => {
		fetchProject({ projectId });
	}, []);

	useEffect(() => {
		fetchProjectItems({ projectId });
	}, []);

	if (!project) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<ProjectDetailHeader project={project} />
			<ProjectDashboard items={projectItems} />
			<ProjectDetailTable items={projectItems} projectId={projectId} />
		</div>
	);
};

const mapStateToProps = (state, { match }) => {
	return {
		project: state.projects[match.params.id],
		projectItems: Object.values(state.projectItems),
	};
};

export default connect(mapStateToProps, {
	fetchProject,
	fetchProjectItems,
})(ProjectDetail);
