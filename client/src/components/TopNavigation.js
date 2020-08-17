import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { signOut } from '../actions';
import './TopNavigation.css';

const TopNavigation = ({ isSignedIn, signOut }) => {
	return (
		<nav className="top-navigation">
			<ul className="top-navigation-list">Welcome to Progress Tracker</ul>
			<ul className="top-navigation-list top-navigation-list__right">
				{isSignedIn ? (
					<button onClick={signOut} className="top-navigation-link">
						Sign Out
					</button>
				) : (
					<>
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
					</>
				)}
			</ul>
		</nav>
	);
};

const mapStateToProps = (state) => {
	return {
		isSignedIn: state.auth.isSignedIn,
	};
};

export default connect(mapStateToProps, { signOut })(TopNavigation);
