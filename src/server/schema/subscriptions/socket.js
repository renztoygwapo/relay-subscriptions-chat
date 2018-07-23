// @flow

import subscriptions from 'server/schema/subscriptions';


import type {IncomingMessage} from 'http';
import type {$Request, $Response} from 'express';
import type {Socket, SocketNamespace} from 'socket.io';

import type {PassportUser, PassportSession} from 'server/session/passport';
import type {SubscriptionData} from './store/subscriptions';

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

type MessageData = {
	type: string,
	data: SubscriptionData
};


export default class SubscriptionSocket {

	client: Client;
	subscriptions: typeof subscriptions;

	constructor (client: Client) {
		this.client = client;
		this.authenticate (client);
	}

	authenticate (client: Client) {
		if (client.request.isAuthenticated ()) {
			client.user = this.sessionUser ();
			this.subscribeClient ();
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

	subscribeClient () {
		const {client} = this;

		subscriptions.registerClient (client);

		client.on ('disconnect', () =>
			subscriptions.unregisterClient (client)
		);

		client.on ('message', ({type, data}: MessageData) => {
			if (type === 'SUBSCRIBE') {
				subscriptions.subscribe (client, data);
			}
			if (type === 'UNSUBSCRIBE') {
				subscriptions.unsubscribe (client, data);
			}
		});

		return client;
	}
}