// @flow

import User from './user';
import Message from './message';

export default {

	id: () => 'app:stats',

	users: {
		async online () {
			return await Promise.resolve (0);
		},

		async total () {
			return await User.count ();
		}
	},

	messages: {
		async total () {
			return await Message.count ();
		}
	}
}