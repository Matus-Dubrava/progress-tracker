import React from 'react';

import { Link } from 'react-router-dom';

export default () => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
					<Link to="/test">Test Link</Link>
				</li>
			</ul>
		</nav>
	);
};
