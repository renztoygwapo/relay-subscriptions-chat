// @flow

import {graphql} from 'react-relay';
import {subscriptions} from 'components/environment';

const SubscriptionQuery = graphql`
	subscription MessageUpdatedSubscription {
	    messageUpdated {
			message {
				id
				text
			}
	    }
	}
`;

export default () =>
	subscriptions.createSubscription (SubscriptionQuery);