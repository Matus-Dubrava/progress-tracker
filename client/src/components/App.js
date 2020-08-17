import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import history from '../history';
import SideNavigation from './SideNavigation';
import TopNavigation from './TopNavigation';
import Landing from './Landing';
import Signup from './auth/Signup';
import { getLoginStatus } from '../actions';

function App({ getLoginStatus }) {
	useEffect(() => {
		getLoginStatus();
	});

	return (
		<Router history={history}>
			<div className="row no-gutters">
				<div className="col-sm-2">
					<SideNavigation />
				</div>

				<div className="col-sm-10">
					<TopNavigation />
					<div className="container">
						<Switch>
							<Route path="/" exact component={Landing} />
							<Route path="/signup" component={Signup} />
						</Switch>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default connect(null, { getLoginStatus })(App);
