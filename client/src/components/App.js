import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import history from '../history';
import Navigation from './Navigation';
import Landing from './Landing';
import Signup from './auth/Signup';

function App() {
	return (
		<Router history={history}>
			<h1>App</h1>
			<Navigation />

			<Switch>
				<Route path="/" exact component={Landing} />
				<Route path="/signup" component={Signup} />
			</Switch>
		</Router>
	);
}

export default App;
