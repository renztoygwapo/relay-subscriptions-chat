// @flow

import {subscriptions} from 'server/schema/subscriptions';
import AuthenticatedSocket from 'server/ws/socket/authenticated';

import type {Client} from 'server/ws/socket/authenticated';
import type {SubscriptionData} from 'server/schema/subscriptions'

type MessageData = {
	type: string,
	data: SubscriptionData
};

export default (client: Client) =>
	new AuthenticatedSocket (client, () =>
		client.on ('message', ({type, data}: MessageData) => {
			if (type === 'SUBSCRIBE') {
				subscriptions.registerSubscription (client, data);
			}
			if (type === 'UNSUBSCRIBE') {
				subscriptions.unregisterSubscription (client, data);
			}
		})
	);