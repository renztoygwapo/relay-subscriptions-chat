// @flow

import uuid from 'uuid';
import {graphql} from 'react-relay';
import commitMutation from './commit';

import type {Environment} from 'react-relay';

type MutationData = {
	text: string
};


const mutation = graphql`
	mutation MessageAddMutation (
		$input: MessageAddInput!
	) {
		messageAdd (input: $input) {
			user {
				...UserPreview
			}
			stats {
				...HeaderTotalMessages
			}

			addedMessageEdge {
				cursor
				node {
					id
					...MessagePreview
				}
			}
		}
	}
`;


export default (environment: Environment, {
	text
}: MutationData) => {
	const variables = {
		input: {
			text,
			clientMutationId: uuid.v4 ()
		}
	};

	return commitMutation (environment, {
		mutation,
		variables,
		configs: [{
			type: 'RANGE_ADD',
			parentID: 'client:root',
			connectionInfo: [{
				key: 'MessagesList_messages',
				rangeBehavior: 'prepend'
			}],
			edgeName: 'addedMessageEdge'
		}]
	});
}