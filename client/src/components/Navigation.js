import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Navigation = ({ isSignedIn, name, email }) => {
	return (
		<nav>
			<ul>
				{isSignedIn ? (
					<li>
						<Link to="/">Home</Link>
						<Link to="/test">Test Link</Link>
					</li>
				) : (
					<li>
						<Link to="/signup">Sign Up</Link>
						<Link to="/signin">Sign In</Link>
					</li>
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
