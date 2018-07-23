// @flow

import {graphql} from 'react-relay';
import {subscriptions} from 'components/environment';

const SubscriptionQuery = graphql`
	subscription UserUpdatedSubscription {
	    userUpdated {
			user {
				id
				...UserPreview
			}
	    }
	}
`;

export default () =>
	subscriptions.createSubscription (SubscriptionQuery);