// @flow

import User from 'server/schema/types/user';

import PubSub from './pubsub';
import UsersRegistry from './registry/users';
import SubscriptionsRegistry from './registry/subscriptions';


import type {PassportUser} from 'server/session/passport';

export type SubscriptionId = string;
export type SubscriptionName = string;
export type SubscriptionData = {
	query: string,
	variables: Object,
	subscriptionId: SubscriptionId,
	subscriptionName: SubscriptionName
};


export const pubsub = new PubSub ();

export const users = new UsersRegistry ({
	onUserConnect: async ({id, name}: PassportUser) => {
		await User.updateOnlineStatus (id, true);

		console.log (`* subscriptions user online ${id}.${name}`);
	},
	onUserDisconnect: async ({id, name}: PassportUser) => {
		await User.updateOnlineStatus (id, false);

		console.log (`* subscriptions user offline ${id}.${name}`);
	}
});

export const subscriptions = new SubscriptionsRegistry (pubsub);