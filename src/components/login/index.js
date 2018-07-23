// @flow

import React, {Component} from 'react';

import {login, getSession} from 'components/lib/session';

import type {RouterHistory} from 'react-router-dom';

type Props = {
	history: RouterHistory
};

type State = {
	[key: string]: string
};


export default class LoginPage extends Component <Props, State> {

	refs: {
		input: HTMLInputElement
	};

	constructor (props: Props) {
		super (props);

		this.state = {
			username: 'anonymous',
			password: 'letmein'
		};

		(this: any).onFieldChange = this.onFieldChange.bind (this);
		(this: any).onSubmit = this.onSubmit.bind (this);
		(this: any).onLogin = this.onLogin.bind (this);
		(this: any).onError = this.onError.bind (this);
	}

	componentDidMount () {
		getSession ()
			.then (this.onLogin)
			.catch (this.onError);

		this.refs.input.focus ();
	}

	onLogin () {
		this.props.history.push ('/');
	}

	onError (e: Error) {
		console.error ('login error:', e.stack || e);
	}

	onFieldChange ({
		target: {name, value}
	}: SyntheticInputEvent <EventTarget>) {
		this.setState ({[name]: value});
	}

	onSubmit (e: Event) {
		const {username, password} = this.state;

		login ({username, password})
			.then (this.onLogin)
			.catch (this.onError)

		e.preventDefault ();
	}

	render () {
		const {username, password} = this.state;

		return (
			<div className="login-page">
				<form onSubmit={this.onSubmit}>
					<div className="form-group">
						<input
							type="text"
							ref="input"
							name="username"
							value={username}
							className="form-control"
							placeholder="username"
							onChange={this.onFieldChange}/>
					</div>

					<div className="form-group">
						<input
							type="password"
							name="password"
							value={password}
							className="form-control"
							placeholder="password"
							onChange={this.onFieldChange}/>
					</div>

					<input
						type="submit"
						style={{display: 'none'}}/>
				</form>
			</div>
		);
	}
}