import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './SideNavigation.css';
import { signOut } from '../actions';

const SideNavigation = ({ isSignedIn, name, email, signOut }) => {
	return (
		<nav className="navigation">
			<div className="navigation-header">
				<div className="navigation-header-content">
					{isSignedIn ? `Welcome, ${name}` : `anonymous`}
				</div>
			</div>
			<div className="navigation-separator">Navigation</div>
			<ul className="navigation-list">
				<li className="navigation-item">
					<Link className="navigation-link" to="/">
						Home
					</Link>
				</li>
				<li className="navigation-item active">
					<Link className="navigation-link" to="/">
						Test
					</Link>
				</li>
				<li className="navigation-item">
					<Link className="navigation-link" to="/">
						Test
					</Link>
				</li>
			</ul>
		</nav>
	);
};

const mapStateToProps = (state) => {
	return {
		isSignedIn: state.auth.isSignedIn,
		name: state.auth.name,
		email: state.auth.email,
	};
};

export default connect(mapStateToProps, { signOut })(SideNavigation);
