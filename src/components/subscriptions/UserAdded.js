// @flow

import {graphql} from 'react-relay';
import {subscriptions} from 'components/environment';

const SubscriptionQuery = graphql`
	subscription UserAddedSubscription {
	    userAdded {
			stats {
				...HeaderTotalUsers
			}

			addedUserEdge {
				cursor
				node {
					id
					...UserPreview
				}
			}
	    }
	}
`;

const SubscriptionConfigs = [{
	type: 'RANGE_ADD',
	parentID: 'client:root',
	connectionInfo: [{
		key: 'UsersList_users',
		rangeBehavior: 'prepend'
	}],
	edgeName: 'addedUserEdge'
}];

export default () =>
	subscriptions.createSubscription (
		SubscriptionQuery, null, SubscriptionConfigs
	);