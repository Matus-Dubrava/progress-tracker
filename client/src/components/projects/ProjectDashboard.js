import React from 'react';
import * as d3 from 'd3';

import './ProjectDashboard.css';

const ProjectDashboard = ({ items }) => {
	let openTasks = 0;
	let closedTasks = 0;
	let openIssues = 0;
	let closedIssues = 0;

	items.forEach((item) => {
		if (item.category === 'task') {
			if (item.isFinished) {
				closedTasks += 1;
			} else {
				openTasks += 1;
			}
		} else if (item.category === 'issue') {
			if (item.isFinished) {
				closedIssues += 1;
			} else {
				openIssues += 1;
			}
		}
	});

	return (
		<div className="content-box project-dashboard">
			<div className="project-dashboard-box dark-green">
				<div className="project-dashboard-box-number dark-green">
					{openTasks}
				</div>
				<div className="project-dashboard-box-sub">Active Tasks</div>
			</div>
			<div className="project-dashboard-box light-green">
				<div className="project-dashboard-box-number light-green">
					{closedTasks}
				</div>
				<div className="project-dashboard-box-sub">Closed Tasks</div>
			</div>
			<div className="project-dashboard-box dark-orange">
				<div className="project-dashboard-box-number dark-orange">
					{openIssues}
				</div>
				<div className="project-dashboard-box-sub">Active Issues</div>
			</div>
			<div className="project-dashboard-box light-orange">
				<div className="project-dashboard-box-number light-orange">
					{closedIssues}
				</div>
				<div className="project-dashboard-box-sub">Closed Issues</div>
			</div>
		</div>
	);
};

export default ProjectDashboard;
