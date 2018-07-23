// @flow

import uuid from 'uuid';
import {graphql} from 'react-relay';

import commitMutation from './commit';

import type {Environment} from 'react-relay';

type MutationData = {
	messageId: string,
	text: string
};

const mutation = graphql`
	mutation MessageUpdateMutation (
		$input: MessageUpdateInput!
	) {
		messageUpdate (input: $input) {
			message {
				id
				text
			}
		}
	}
`;

export default (environment: Environment, {
	messageId,
	text
}: MutationData) => {
	const variables = {
		input: {
			messageId,
			text,
			clientMutationId: uuid.v4 ()
		}
	};

	return commitMutation (environment, {
		mutation,
		variables
	});
}