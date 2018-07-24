// @flow

import {graphql} from 'graphql';

import {rootValue} from 'server/schema';
import schema from 'server/schema/schema';
import PubSub from 'server/schema/subscriptions/pubsub';


import type {Client} from 'server/ws/socket/authenticated';

import type {
	SubscriptionId,
	SubscriptionData
} from 'server/schema/subscriptions'

type SubscriptionEntry = {
	client: Client,
	callback: Function,
	data: SubscriptionData
};

type SubscriptionsMap = Map <SubscriptionId, SubscriptionEntry>;


type PublishContext = {
	headers?: {[key: string]: ?string}
};

type PublishData = {
	resolvers: Object,
	context?: PublishContext
};


const getInitiatorId = (ctx?: PublishContext): string =>
	(ctx && ctx.headers && ctx.headers ['x-ws-client-id']) || 'server-event';

const getQueryData = ({query, variables, resolvers, context}) =>
	graphql (schema, query, {...rootValue, ...resolvers}, context, variables);

const createCallback = (
	id: SubscriptionId,
	client: Client,
	subscriptions: SubscriptionsMap,
) => async ({resolvers, context}: PublishData) => {
		const entry = subscriptions.get (id);

		if (entry) {
			const {client} = entry;
			const initiatorId = getInitiatorId (context);

			if (client.id === initiatorId) {
				return;
			}

			const {query, variables} = entry.data;
			const data =  await getQueryData ({
				query, context, variables, resolvers
			});

			client.send ({subscriptionId: id, data});
		}
	};


export default class SubscriptionsStore {

	pubsub: PubSub;
	subscriptions: SubscriptionsMap;

	constructor (pubsub: PubSub) {
		this.pubsub = pubsub;
		this.subscriptions = new Map ();
	}

	registerSubscription (client: Client, data: SubscriptionData) {
		const {subscriptionName, subscriptionId: id} = data;
		const entry = this.subscriptions.get (id) || {
			data,
			client,
			callback: createCallback (id, client, this.subscriptions)
		};

		this.subscriptions.set (id, entry);
		this.pubsub.subscribe (subscriptionName, entry.callback);

		console.log (`* registered subscription ${id}@${subscriptionName}`)
	}

	unregisterSubscription (client: Client, data: SubscriptionData) {
		const {subscriptionName, subscriptionId: id} = data;
		const entry = this.subscriptions.get (id);

		if (!entry) {
			return;
		}

		this.pubsub.unsubscribe (subscriptionName, entry.callback);

		console.log (`* unregistered subscription ${id}@${subscriptionName}`);
	}
}