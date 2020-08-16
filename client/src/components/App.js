import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import history from '../history';
import Navigation from './Navigation';
import Landing from './Landing';

function App() {
	return (
		<Router history={history}>
			<h1>App</h1>
			<Navigation />

			<Switch>
				<Route path="/" exact component={Landing} />
			</Switch>
		</Router>
	);
}

export default App;
