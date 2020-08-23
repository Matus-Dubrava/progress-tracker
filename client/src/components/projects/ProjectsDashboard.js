import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './ProjectsDashboard.css';
import { fetchProjectsSummary } from '../../actions';

const ProjectsDashboard = ({ fetchProjectsSummary, projectsSummary }) => {
	useEffect(() => {
		fetchProjectsSummary();
	}, []);

	return (
		<div className="projects-dashboard">
			<div className="projects-dashboard-card">
				<div className="projects-dashboard-card-header">
					Total Projects
				</div>
				<div className="projects-dashboard-card-content">
					{projectsSummary.totalProjectsCount}
				</div>
			</div>
			<div className="projects-dashboard-card">
				<div className="projects-dashboard-card-header">
					Active Projects
				</div>
				<div className="projects-dashboard-card-content">
					{projectsSummary.activeProjectsCount}
				</div>
			</div>
			<div className="projects-dashboard-card">
				<div className="projects-dashboard-card-header">
					Finished Projects
				</div>
				<div className="projects-dashboard-card-content">
					{projectsSummary.finishedProjectsCount}
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		projectsSummary: state.projectsSummary,
	};
};

export default connect(mapStateToProps, { fetchProjectsSummary })(
	ProjectsDashboard
);
