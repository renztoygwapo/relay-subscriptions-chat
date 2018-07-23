// @flow

import {commitMutation} from 'react-relay';

import type {Environment} from 'react-relay';

export default (environment: Environment, options: Object) =>
	new Promise ((resolve, reject) => {
		const disposable = commitMutation (
			environment,
			{
				onCompleted: (response: Object) => {
					console.log ('* mutation response:', response);
					resolve (disposable);
				},
				onError: (err: Error) => {
					console.error ('* mutation error:', err);
					reject (err);
				},
				...options
			}
		);
	});