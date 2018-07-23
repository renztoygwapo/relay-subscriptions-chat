// @flow

import {offsetToCursor} from 'graphql-relay';

import User from 'server/schema/types/user';
import Message from 'server/schema/types/message';
import stats from 'server/schema/types/stats';

import subscriptions from 'server/schema/subscriptions';


type MessageAddInput = {
	input: {
		clientMutationId: string,
		userId: string,
		text: string
	}
};

type MessageRemoveInput = {
	input: {
		clientMutationId: string,
		messageId: string
	}
};

type MessageUpdateInput = {
	input: {
		clientMutationId: string,
		messageId: string,
		text: string
	}
};

export default {

	messageAdd: async ({input}: MessageAddInput, context: Object) => {
		const {clientMutationId, text} = input;
		const user = await User.getFromContext (context);
		const node = await Message.createMessage ({text, userId: user.id});

		const messageAdded = {
			user,
			stats,
			addedMessageEdge: {
				node,
				cursor: offsetToCursor (0)
			}
		};

		subscriptions.publish (
			'MessageAddedSubscription',
			{messageAdded},
			context
		);

		return {...messageAdded, clientMutationId};
	},

	messageRemove: async ({input}: MessageRemoveInput, context: Object) => {
		const {clientMutationId, messageId} = input;
		const user = await User.getFromContext (context);

		await Message.removeMessage ({messageId, userId: user.id});

		const messageRemoved = {
			user,
			stats,
			removedMessageId: messageId
		};

		subscriptions.publish (
			'MessageRemovedSubscription',
			{messageRemoved},
			context
		);

		return {...messageRemoved, clientMutationId};
	},

	messageUpdate: async ({input}: MessageUpdateInput, context: Object) => {
		const {clientMutationId, text, messageId} = input;
		const user = await User.getFromContext (context);

		const messageUpdated = {
			message: await Message.updateMessage ({messageId, text, userId: user.id})
		};

		subscriptions.publish (
			'MessageUpdatedSubscription',
			{messageUpdated},
			context
		);

		return {...messageUpdated, clientMutationId};
	}
}