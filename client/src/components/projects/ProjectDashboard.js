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
			<div className="project-dashboard-box">
				<div className="project-dashboard-box-header">Active Tasks</div>
				<div className="project-dashboard-box-content">{openTasks}</div>
			</div>
			<div className="project-dashboard-box">
				<div className="project-dashboard-box-header">Closed Tasks</div>
				<div className="project-dashboard-box-content">
					{closedTasks}
				</div>
			</div>
			<div className="project-dashboard-box">
				<div className="project-dashboard-box-header">
					Active Issues
				</div>
				<div className="project-dashboard-box-content">
					{openIssues}
				</div>
			</div>
			<div className="project-dashboard-box">
				<div className="project-dashboard-box-header">
					Closed Issues
				</div>
				<div className="project-dashboard-box-content">
					{closedIssues}
				</div>
			</div>
		</div>
	);
};

export default ProjectDashboard;
