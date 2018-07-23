// @flow

import uuid from 'uuid';
import {graphql} from 'react-relay';

import commitMutation from './commit';

import type {Environment} from 'react-relay';

type MutationData = {
	messageId: string
};

const mutation = graphql`
	mutation MessageRemoveMutation (
		$input: MessageRemoveInput!
	) {
		messageRemove (input: $input) {
			user {
				...UserPreview
			}
			stats {
				...HeaderTotalMessages
			}

			removedMessageId
		}
	}
`;

export default (environment: Environment, {
	messageId
}: MutationData) => {
	const variables = {
		input: {
			messageId,
			clientMutationId: uuid.v4 ()
		}
	};

	return commitMutation (environment, {
		mutation,
		variables,
		configs: [{
			type: 'RANGE_DELETE',
			parentID: 'client:root',
			connectionKeys: [{
				key: 'MessagesList_messages'
			}],
			pathToConnection: ['client:root', 'messages'],
			deletedIDFieldName: 'removedMessageId'
		}, {
			type: 'NODE_DELETE',
			deletedIDFieldName: 'removedMessageId'
		}]
	});
}