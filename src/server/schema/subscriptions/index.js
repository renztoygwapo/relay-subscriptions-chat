// @flow

import User from 'server/schema/types/user';

import Store from './store';
import Pubsub from './pubsub';

import type {PassportUser} from 'server/session/passport';

const store = new Store ({
	onUserConnect: async ({id, name}: PassportUser) => {
		await User.updateOnlineStatus (id, true);

		console.log (`* subscriptions user online ${id}.${name}`);
	},
	onUserDisconnect: async ({id, name}: PassportUser) => {
		await User.updateOnlineStatus (id, false);

		console.log (`* subscriptions user offline ${id}.${name}`);
	}
});

export default new Pubsub (store);