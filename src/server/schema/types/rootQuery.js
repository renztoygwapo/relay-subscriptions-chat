// @flow

import User, {userConnection} from 'server/schema/types/user';
import Message, {messageConnection} from 'server/schema/types/message';
import stats from './stats';

import type {PassportRequest} from 'server/session/passport';

export default {

	stats,

	async me (variables: Object, context: PassportRequest) {
		const {session} = context;

		if (!session || !session.passport || !session.passport.user) {
			return null;
		}

		const {user} = session.passport;
		const found: ?Object = await User.getById (user.id);

		if (found) {
			return new User (found);
		}
	},

	async users (variables: Object) {
		return userConnection (
			await User.buildQuery (variables),
			variables
		);
	},

	async messages (variables: Object) {
		return messageConnection (
			await Message.buildQuery (variables),
			variables
		);
	}
}