import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import history from '../history';
import Navigation from './Navigation';
import Landing from './Landing';
import Signup from './auth/Signup';

function App() {
	return (
		<Router history={history}>
			<Navigation />

			<div className="app-container">
				<div className="container">
					<Switch>
						<Route path="/" exact component={Landing} />
						<Route path="/signup" component={Signup} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
