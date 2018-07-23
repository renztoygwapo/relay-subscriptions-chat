// @flow

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {getSession} from 'components/lib/session';
import Loader from 'components/Loader';


import type {ComponentType} from 'react';
import type {Location, RouterHistory} from 'react-router-dom';

type Props = {
	location: Location,
	history: RouterHistory,
	staticContext?: {
		user: Object
	}
};

type State = {
	authenticated: boolean
};


let redirectCounter = 0;
const REDIRECT_LIMIT = 3;


export default (BaseComponent: ComponentType <any>): ComponentType <any> => {
	class Restricted extends Component <Props, State> {
		constructor (props: Props) {
			super (props);

			this.state = {
				authenticated: false
			};

			(this: any).onAuthError = this.onAuthError.bind (this);
			(this: any).onAuthenticate = this.onAuthenticate.bind (this);
		}

		componentDidMount () {
			this.checkAuthentication ();
		}

		componentWillReceiveProps ({location}) {
			if (location !== this.props.location) {
				this.checkAuthentication ();
			}
		}

		checkAuthentication () {
			getSession ()
				.then (this.onAuthenticate)
				.catch (this.onAuthError);
		}

		onAuthenticate () {
			this.setState ({
				authenticated: true
			});
		}

		onAuthError (e: Error) {
			redirectCounter++;

			if (redirectCounter < REDIRECT_LIMIT) {
				this.props.history.replace ({pathname: '/login'});
			} else {
				redirectCounter = 0;

				console.error ('* redirect error:', e.message);
			}
		}

		render () {
			return this.state.authenticated ? (
				<BaseComponent {...this.props}/>
			) : <Loader/>;
		}
	}

	return withRouter (Restricted);
}
