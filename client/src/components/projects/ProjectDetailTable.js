import React from 'react';
import { Link } from 'react-router-dom';

import { parseDateTime } from '../../helpers/parse-date-time';
import './ProjectDetailTable.css';

const ProjectDetailTable = ({ items, projectId }) => {
	// sort items from newest to oldest
	items.sort((a, b) => {
		return new Date(b.dateCreated) - new Date(a.dateCreated);
	});

	const renderedTableItems = items.map((item) => {
		return (
			<tr key={item.id}>
				<td>
					<Link to={`/projects/${projectId}/items/${item.id}`}>
						{item.title}
					</Link>
				</td>
				<td>
					<span className={`category category-${item.category}`}>
						{item.category}
					</span>
				</td>
				<td>
					<span
						className={`category category-${
							item.isFinished ? 'closed' : 'open'
						}`}
					>
						{item.isFinished ? 'closed' : 'open'}
					</span>
				</td>
				<td>{parseDateTime(item.dateCreated)}</td>
				<td>{parseDateTime(item.dateUpdated)}</td>
				<td>{item.dateFinished && parseDateTime(item.dateFinished)}</td>
			</tr>
		);
	});

	return (
		<table className="project-detail-table content-box">
			<thead>
				<tr>
					<td>Title</td>
					<td>Category</td>
					<td>Status</td>
					<td>Created At</td>
					<td>Last Update At</td>
					<td>Closed At</td>
				</tr>
			</thead>
			<tbody>{renderedTableItems}</tbody>
		</table>
	);
};

export default ProjectDetailTable;
