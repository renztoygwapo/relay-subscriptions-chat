// @flow

import React from 'react';
import {Route, Switch} from 'react-router-dom';


import App from 'components/App';
import AppQuery from './queries/AppQuery';
import Login from 'components/login';

import render from './render';
import restricted from './restricted';

import type {Environment} from 'relay-runtime';

type Props = {
	environment: Environment
};

export default ({environment}: Props) =>
	<Switch>
		<Route
			exact
			path="/login"
			component={Login}/>

		<Route
			exact
			path="/"
			component={restricted (
				render (environment, App, AppQuery)
			)}/>
	</Switch>
