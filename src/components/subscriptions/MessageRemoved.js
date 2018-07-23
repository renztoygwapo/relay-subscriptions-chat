// @flow

import {graphql} from 'react-relay';
import {subscriptions} from 'components/environment';

const SubscriptionQuery = graphql`
	subscription MessageRemovedSubscription {
	    messageRemoved {
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

const SubscriptionConfigs = [{
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
}];

export default () =>
	subscriptions.createSubscription (
		SubscriptionQuery, null, SubscriptionConfigs
	);