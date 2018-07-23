// @flow

import {fromGlobalId} from 'graphql-relay';
import type {MongooseDocument} from 'mongoose';

import User from './user';
import Message from './message';

type Entity = Class <User | Message>;

const getById = (T: Entity) =>
	async (id: string) => {
		const doc: ?MongooseDocument = await T
			.MongooseModel
			.findById (id)

		if (doc) {
			return new T (doc);
		}
	}

const types = {
	User: getById (User),
	Message: getById (Message)
};

export default class Node {
	static fromGlobalId (globalId: string): Promise <Message> | Promise <User> {
		const {type, id} = fromGlobalId (globalId);

		return types [type] (id);
	}
}