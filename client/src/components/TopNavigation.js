import React from 'react';
import { Link } from 'react-router-dom';

import './TopNavigation.css';

const TopNavigation = () => {
	return (
		<nav className="top-navigation">
			<ul className="top-navigation-list">Welcome to Progress Tracker</ul>
			<ul className="top-navigation-list top-navigation-list__right">
				<li className="top-navigation-item">
					<Link className="top-navigation-link" to="/signup">
						Sign Up
					</Link>
				</li>
				<li className="top-navigation-item">
					<Link className="top-navigation-link" to="/signin">
						Sign In
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default TopNavigation;
