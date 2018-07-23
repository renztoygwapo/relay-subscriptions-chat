// @flow

import {graphql} from 'graphql';

import {rootValue} from 'server/schema';
import schema from 'server/schema/schema';

type SubscriptionId = string;
export type SubscriptionName = string;

export type SubscriptionData = {
	query: string,
	variables: Object,
	subscriptionId: SubscriptionId,
	subscriptionName: SubscriptionName
};

type QueryRequestData = SubscriptionData & {
	resolvers: Object,
	context?: Object
};

export type QueryBuilder = (data: SubscriptionData) => QueryRequestData;
export type SubscriptionsResolvedData = Map <SubscriptionId, Object>;

type NamespaceEntry = Map <SubscriptionId, SubscriptionData>;
type SubscriptionsMap = Map <SubscriptionName, NamespaceEntry>;

interface iSubscriptionsStore {
	subscriptions: SubscriptionsMap,

	registerSubscription (data: SubscriptionData): NamespaceEntry,
	unregisterSubscription (data: SubscriptionData): ?NamespaceEntry,

	resolveSubscriptions (
		namespace: SubscriptionName,
		queryBuilder: QueryBuilder
	): Promise <?SubscriptionsResolvedData>
}

const queryResult = async ({
	query,
	variables,
	context,
	resolvers,
	subscriptionId
}: QueryRequestData) => ({
	subscriptionId,
	data: await graphql (
		schema,
		query,
		{...rootValue, ...resolvers},
		context,
		variables
	)
});


export default class SubscriptionsStore implements iSubscriptionsStore {

	subscriptions: SubscriptionsMap;

	constructor () {
		this.subscriptions = new Map ();
	}

	registerSubscription (data: SubscriptionData) {
		const {subscriptionName, subscriptionId} = data;

		const namespaceEntry = this.subscriptions
			.get (subscriptionName) || (new Map (): NamespaceEntry);

		console.log (`* register subscription ${subscriptionId}@${subscriptionName}`)

		namespaceEntry.set (subscriptionId, data);
		this.subscriptions.set (subscriptionName, namespaceEntry);

		return namespaceEntry;
	}

	unregisterSubscription (data: SubscriptionData) {
		const {subscriptionName, subscriptionId} = data;

		const namespaceEntry = this.subscriptions.get (subscriptionName);

		if (!namespaceEntry) {
			return;
		}

		namespaceEntry.delete (subscriptionId);

		return namespaceEntry;
	}

	async resolveSubscriptions (
		namespace: SubscriptionName,
		queryBuilder: QueryBuilder
	) {

		const namespaceEntry = this.subscriptions.get (namespace);

		if (!namespaceEntry) {
			return;
		}

		const queryResolveResults = (new Map (): SubscriptionsResolvedData);

		for (let [subscriptionId, subscriptionEntry] of namespaceEntry) {
			try {
				queryResolveResults.set (subscriptionId,
					await queryResult (
						queryBuilder (subscriptionEntry)
					)
				);
			} catch (e) {
				console.error ('* resolve subscription error', e);
			}
		}

		return queryResolveResults;
	}
}