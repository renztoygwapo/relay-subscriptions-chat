// @flow

import uuid from 'uuid';
import io from 'socket.io-client';

import {requestSubscription} from 'relay-runtime';


import type {
	GraphQLTaggedNode,
	ConcreteBatch,
	CacheConfig,
	Observer,
	Variables,
	RelayMutationConfig
} from 'react-relay';

import type {
	Environment
} from 'relay-runtime';

import type {
	Socket
} from 'socket.io-client';

type WebSocketSettings = {
	reconnectionAttempts: number
};

type SubscriptionId = string;

type SubscriptionData = {
	query: string,
	variables: ?Object,
	subscriptionName: string,
	subscriptionId: SubscriptionId
};

type SubscribeMessageData = {
	type: string,
	data: SubscriptionData
};

type ServerResponseMessage = {
	subscriptionId: string,
	data: Object
};

type SubscriptionsMap = Map <SubscriptionId, Observer <*>>;


const OPTIONS = {
	path: '/ws',
	reconnectionAttempts: 10
};


export default class Subscriptions {

	websocket: Socket;
	webSocketSettings: WebSocketSettings;

	subscriptions: SubscriptionsMap;
	subscriptionEnvironment: Environment;


	constructor () {
		this.subscriptions = new Map ();
		this.webSocketSettings = OPTIONS;

		(this: any).setupSubscription = this.setupSubscription.bind (this);
		(this: any).createSubscription = this.createSubscription.bind (this);
		(this: any).receivePayload = this.receivePayload.bind (this);
	}

	setEnvironment (environment: Environment) {
		return this.subscriptionEnvironment = environment;
	}

	ensureConnection () {
		if (!this.websocket) {
			this.websocket = io ('/', this.webSocketSettings);
			this.websocket.on ('message', this.receivePayload);
			this.websocket.on ('connect', () =>
				console.log ('* subscriptions connected')
			);
		}
	}

	getClientId () {
		return this.websocket ? this.websocket.id : null;
	}

	receivePayload ({data, subscriptionId}: ServerResponseMessage) {
		const observer = this.subscriptions.get (subscriptionId);

		if (observer && observer.onNext) {
			observer.onNext (data);
		}
	}

	createSubscription (
		subscription: GraphQLTaggedNode,
		variables?: Variables,
		configs?: Array <RelayMutationConfig>,
	) {
		this.ensureConnection ();

		return requestSubscription (
			this.subscriptionEnvironment, {
				subscription,
				variables,
				configs
			}
		);
	}

	setupSubscription (
		config: ConcreteBatch,
		variables: ?Variables,
		cacheConfig: ?CacheConfig,
		observer: Observer <*>
	) {
		if (!config.text) {
			throw new Error (
				'missing subscription query'
			);
		}

		const query = config.text;
		const {name: subscriptionName} = config;
		const subscriptionId = uuid.v4 ();

		this.subscriptions.set (subscriptionId, observer);

		const subscriptionData: SubscribeMessageData = {
			type: 'SUBSCRIBE',
			data: {
				query,
				variables,
				subscriptionId,
				subscriptionName
			}
		};

		this.websocket.send (subscriptionData);
	}
}