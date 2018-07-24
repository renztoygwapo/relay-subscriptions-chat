// @flow

import {users} from 'server/schema/subscriptions';
import AuthenticatedSocket from 'server/ws/socket/authenticated';

import type {Client} from 'server/ws/socket/authenticated';


export default (client: Client) =>
	new AuthenticatedSocket (client, () => {
		users.registerClient (client);

		client.on ('disconnect', () =>
			users.unregisterClient (client)
		)
	});