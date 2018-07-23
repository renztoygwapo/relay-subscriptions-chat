// @flow

import type {Client} from './socket';
import type {SubscriptionData} from './store/subscriptions';
import type {default as Store} from './store';

type PublishContext = {
	headers?: {[key: string]: ?string}
};

export default class SubscriptionsPubSub {

	store: Store;

	constructor (store: Store) {
		this.store = store;
	}

	registerClient (client: Client) {
		this.store.registerClient (client);
	}

	unregisterClient (client: Client) {
		this.store.unregisterClient (client);
	}

	subscribe (client: Client, data: SubscriptionData) {
		this.store.registerSubscription (client, data);
	}

	unsubscribe (client: Client, data: SubscriptionData) {
		this.store.unregisterSubscription (client, data);
	}

	async publish (
		subscriptionName: string,
		resolvers: Object,
		context?: PublishContext
	) {
		const initiatorId: string = (
			context &&
			context.headers &&
			context.headers ['x-ws-client-id']
		) || 'server-event';

		const queryBuilder = (data) => ({...data, context, resolvers});

		console.log (`* triggered subscription ${subscriptionName} by ${initiatorId}`);

		this.store.broadcast (subscriptionName, initiatorId, queryBuilder);
	}
}