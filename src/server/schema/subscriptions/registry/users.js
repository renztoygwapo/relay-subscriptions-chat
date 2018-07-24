// @flow

import type {Client} from 'server/ws/socket/authenticated';

type UserId = string;
type ClientId = string;

type UserEntry = Map <ClientId, Client>;
type UserStateHandler = (user: Object) => ?Promise <void>;

type ConstructorProps = {
	onUserConnect: UserStateHandler,
	onUserDisconnect: UserStateHandler
};


export default class ClientsStore {

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
		const entry = this.users.get (user.id) || (new Map (): UserEntry);

		if (!entry.size) {
			this.onUserConnect (user);
		}

		entry.set (client.id, client);
		this.users.set (user.id, entry);

		console.log (`* registered client ${client.id}@${user.id}.${user.name}`);
	}

	unregisterClient (client: Client) {
		const {user} = client;
		const entry = this.users.get (user.id);

		if (entry) {
			entry.delete (client.id);

			if (!entry.size) {
				this.onUserDisconnect (user);
			}

			console.log (`* unregistered client ${client.id}@${user.id}.${user.name}`);
		}
	}
}