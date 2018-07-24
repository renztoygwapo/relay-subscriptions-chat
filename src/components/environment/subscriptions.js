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

type ServerResponse = {
	subscriptionId: string,
	data: Object
};

type SubscriptionEntry = {
	data: SubscriptionData,
	observer: Observer <*>
};

type SubscriptionsMap = Map <SubscriptionId, SubscriptionEntry>;


const OPTIONS = {
	path: '/ws',
	reconnectionAttempts: 10
};


export default class Subscriptions {

	websocket: Socket;
	webSocketSettings: WebSocketSettings;
	reconnecting: boolean;

	subscriptions: SubscriptionsMap;
	subscriptionEnvironment: Environment;


	constructor () {
		this.reconnecting = false;
		this.subscriptions = new Map ();
		this.webSocketSettings = OPTIONS;

		(this: any).setupSubscription = this.setupSubscription.bind (this);
		(this: any).createSubscription = this.createSubscription.bind (this);
		(this: any).onReceivePayload = this.onReceivePayload.bind (this);
	}

	setEnvironment (environment: Environment) {
		return this.subscriptionEnvironment = environment;
	}

	getClientId () {
		return this.websocket ? this.websocket.id : null;
	}

	ensureConnection () {
		if (this.websocket) {
			return;
		}

		this.websocket = io ('/', this.webSocketSettings);
		this.websocket.on ('message', this.onReceivePayload);

		this.websocket.on ('disconnect', () => {
			this.reconnecting = true;
		});

		this.websocket.on ('connect', () => {
			console.log ('* subscriptions connected');

			if (this.reconnecting) {
				this.resubscribe ();
				this.reconnecting = false;
			}
		});
	}

	resubscribe () {
		for (let [, {data}] of this.subscriptions) {
			this.websocket.send ({type: 'SUBSCRIBE', data});
		}
	}

	onReceivePayload ({data, subscriptionId}: ServerResponse) {
		const {observer} = this.subscriptions.get (subscriptionId) || {};

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

		const data: SubscriptionData = {
			query,
			variables,
			subscriptionId,
			subscriptionName
		};

		this.websocket.send ({type: 'SUBSCRIBE', data});
		this.subscriptions.set (subscriptionId, {observer, data});
	}
}