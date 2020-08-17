import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './Navigation.css';

const Navigation = ({ isSignedIn, name, email }) => {
	return (
		<nav className="navigation">
			<ul className="navigation-list">
				{isSignedIn ? (
					<>
						<li className="navigation-item">{name}</li>
						<li className="navigation-item">
							<Link className="navigation-link" to="/">
								Home
							</Link>
						</li>
					</>
				) : (
					<>
						<li className="navigation-item">
							<Link className="navigation-link" to="/signup">
								Sign Up
							</Link>
						</li>
						<li>
							<Link className="navigation-link" to="/signin">
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
		name: state.auth.name,
		email: state.auth.email,
	};
};

export default connect(mapStateToProps)(Navigation);
