// @flow

import type {IncomingMessage} from 'http';
import type {$Request, $Response} from 'express';
import type {Socket, SocketNamespace} from 'socket.io';

import type {
	PassportUser,
	PassportSession
} from 'server/session/passport';

export type SocketContext = {
	request: {
		...IncomingMessage,
		...$Request,
		res: $Response,
		session: PassportSession,
		isAuthenticated: () => boolean
	}
};

export type Client = SocketContext &
	SocketNamespace &
	Socket & {
		user: PassportUser
	};


export default class SubscriptionSocket {

	client: Client;
	subscribe: Function;

	constructor (client: Client, subscribe: Function) {
		this.client = client;
		this.subscribe = subscribe;
		this.authenticate (client);
	}

	authenticate (client: Client) {
		if (client.request.isAuthenticated ()) {
			client.user = this.sessionUser ();
			this.subscribe (client);
		} else {
			client.disconnect ()
		}
	}

	sessionUser () {
		return this.client
			.request
			.session
			.passport
			.user;
	}
}