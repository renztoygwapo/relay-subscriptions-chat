// @flow

import {graphql} from 'react-relay';
import {subscriptions} from 'components/environment';

const SubscriptionQuery = graphql`
	subscription MessageAddedSubscription {
	    messageAdded {
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

const SubscriptionConfigs = [{
	type: 'RANGE_ADD',
	parentID: 'client:root',
	connectionInfo: [{
		key: 'MessagesList_messages',
		rangeBehavior: 'prepend'
	}],
	edgeName: 'addedMessageEdge'
}];

export default () =>
	subscriptions.createSubscription (
		SubscriptionQuery, null, SubscriptionConfigs
	);