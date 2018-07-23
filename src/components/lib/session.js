// @flow

const sessionUrl = () =>
	'https://relay-subscriptions-chat';

const url = sessionUrl ();

const handler = (res) =>
	res
		.json ()
		.then ((data: Object) =>
			res.ok
				? data
				: Promise.reject (data)
		);

export const login = (data: Object) =>
	fetch (`${url}/session`, {
		method: 'POST',
		mode: 'cors',
		credentials: 'include',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify (data)
	})
	.then (handler);

export const logout = () =>
	fetch (`${url}/session`, {
		method: 'DELETE',
		mode: 'cors',
		credentials: 'include',
		headers: {
			'content-type': 'application/json'
		}
	});

export const getSession = () =>
	fetch (`${url}/session`, {
		mode: 'cors',
		credentials: 'include',
		headers: {
			'content-type': 'application/json'
		}
	})
	.then (handler);
