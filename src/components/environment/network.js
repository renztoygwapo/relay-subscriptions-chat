// @flow

import uuid from 'uuid';

import {
	RelayNetworkLayer,
	urlMiddleware,
	batchMiddleware,
	retryMiddleware,
	cacheMiddleware
} from 'react-relay-network-modern';

import Subscriptions from './subscriptions';


type NetworkOptions = {
	url?: string,
	batchUrl?: string,
	subscriptions: Subscriptions
};


export default ({
	url = '/graphql',
	batchUrl = '/graphql/batch',
	subscriptions
}: NetworkOptions) =>
	new RelayNetworkLayer ([

		cacheMiddleware ({
			size: 50,
			ttl: 100000,
			clearOnMutation: true
		}),

		(next) => async (req) => {
			const clientId = subscriptions.getClientId ();

			if (clientId) {
				req.fetchOpts.headers ['x-ws-client-id'] = clientId;
			}

			req.fetchOpts.credentials = 'include';
			req.fetchOpts.headers ['x-request-id'] = uuid.v4 ();

			return await next (req);
		},

		urlMiddleware ({url}),

		batchMiddleware ({
			batchUrl,
			batchTimeout: 60
		}),

		retryMiddleware ({
			fetchTimeout: 15000,
			retryDelays: (attempt: number) => Math.pow (2, attempt + 4) * 100,
			statusCodes: [500, 503, 504]
		})

	], {
		subscribeFn: subscriptions.setupSubscription
	});

