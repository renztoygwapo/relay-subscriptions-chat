// @flow

import {
	Store,
	RecordSource,
	Environment
} from 'relay-runtime';

import Subscriptions from './subscriptions';
import createNetwork from './network';


const store = new Store (new RecordSource ());

export const subscriptions = new Subscriptions ();

const network = createNetwork ({subscriptions});
const environment = new Environment ({network, store});

subscriptions.setEnvironment (environment);

export default environment;
