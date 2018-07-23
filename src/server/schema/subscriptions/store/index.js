// @flow

import Subscriptions from './subscriptions';

import type {Client} from 'server/schema/subscriptions/socket';

import type {
	QueryBuilder,
	SubscriptionName,
	SubscriptionData
} from './subscriptions';

type UserId = string;
type ClientId = string;

type UserEntry = {
	clients: Map <ClientId, Client>,
	subscriptions: Subscriptions
};
type UserStateHandler = (user: Object) => ?Promise <void>;

type ConstructorProps = {
	onUserConnect: UserStateHandler,
	onUserDisconnect: UserStateHandler
};

interface iClientsStore {
	users: Map <UserId, UserEntry>,

	registerClient (client: Client): UserEntry,
	unregisterClient (client: Client): ?UserEntry,

	broadcast (
		namespace: SubscriptionName,
		initiatorId: ClientId,
		queryBuilder: QueryBuilder
	): Promise <void>
}

const createUserEntry = (client: Client) => ({
	clients: new Map ([[client.id, client]]),
	subscriptions: new Subscriptions ()
});

export default class ClientsStore implements iClientsStore {

	users: Map <UserId, UserEntry>;

	onUserConnect: UserStateHandler;
	onUserDisconnect: UserStateHandler;

	constructor ({
		onUserConnect,
		onUserDisconnect
	}: ConstructorProps) {
		this.users = new Map ();

		this.onUserConnect = onUserConnect;
		this.onUserDisconnect = onUserDisconnect;
	}

	registerClient (client: Client) {
		const {user} = client;
		const userEntry = this.users.get (user.id) ||
			createUserEntry (client);

		if (!userEntry.clients.size) {
			this.onUserConnect (user);
		}

		userEntry.clients.set (client.id, client);
		this.users.set (user.id, userEntry);

		console.log (`* registered client ${client.id}@${user.id}.${user.name}`);

		return userEntry;
	}

	unregisterClient (client: Client) {
		const {user} = client;
		const userEntry = this.users.get (user.id);

		if (userEntry) {
			userEntry.clients.delete (client.id);

			if (!userEntry.clients.size) {
				this.onUserDisconnect (user);
			}

			console.log (`* unregistered client ${client.id}@${user.id}.${user.name}`);

			return userEntry;
		}
	}

	registerSubscription (client: Client, data: SubscriptionData) {
		const {user} = client;
		const userEntry = this.users.get (user.id);

		if (userEntry) {
			userEntry.subscriptions.registerSubscription (data);
		}
	}

	unregisterSubscription (client: Client, data: SubscriptionData) {
		const {user} = client;
		const userEntry = this.users.get (user.id);

		if (userEntry) {
			userEntry.subscriptions.unregisterSubscription (data);
		}
	}

	async broadcast (
		subscriptionName: SubscriptionName,
		initiatorId: ClientId,
		queryBuilder: QueryBuilder
	) {
		for (let [userId, userEntry] of this.users) {
			const resolvedData = await userEntry.subscriptions
				.resolveSubscriptions (subscriptionName, queryBuilder);

			if (!resolvedData) {
				continue;
			}

			for (let [clientId, client] of userEntry.clients) {
				if (clientId === initiatorId) {
					continue;
				}

				for (let [subscriptionId, subscriptionResult] of resolvedData) {
					client.send (subscriptionResult);

					console.log (`* published subscription ${subscriptionId} to client ${clientId}@${userId}`);
				}
			}
		}
	}
}