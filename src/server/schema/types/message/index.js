// @flow

import {fromGlobalId} from 'graphql-relay';

import MongooseMessage from 'server/models/message';
import Model from 'server/schema/types/model';
import User from 'server/schema/types/user';

import connection from 'server/schema/connection';

import type {ConnectionArguments} from 'graphql-relay';
import type {MessageMongooseDoc} from 'server/models/message';

type Variables = {
	userId?: string,
	messageId?: string
} & ConnectionArguments;

type MessageData = {
	messageId: string,
	userId: string,
	text?: string
};


export default class Message extends Model {

	_doc: MessageMongooseDoc;

	userId: string;
	text: string;

	static MongooseModel = MongooseMessage;

	static async buildQuery (variables: Variables): Promise <Object> {
		const query = {};

		if (!variables) {
			return query;
		}

		if (variables.userId) {
			const {id} = fromGlobalId (
				variables.userId
			);

			query.userId = {$nin: [id]};
		}

		return query;
	}

	static async createMessage ({userId: userid, text}: $Shape <MessageData>): Promise <Model> {
		const {id: userId} = fromGlobalId (userid);

		// $FlowFixMe mongoose constructor $Shape<this> misses userId, text
		const model = new this.MongooseModel ({userId, text});

		return new Message (await model.save ());
	}

	static async removeMessage ({messageId, userId: userid}: MessageData): Promise <MessageMongooseDoc> {
		const {id: userId} = fromGlobalId (userid);
		const {id: _id} = fromGlobalId (messageId);

		const [message] = await this.MongooseModel.find ({_id, userId});

		if (!message) {
			throw new Error (
				`message ${_id} cannot be removed by ${userId}`
			);
		}

		return await message.remove ();
	}

	static async updateMessage ({messageId, userId: userid, text}: MessageData): Promise <Model> {
		const {id: userId} = fromGlobalId (userid);
		const {id: _id} = fromGlobalId (messageId);

		const [message] = await this.MongooseModel.find ({_id, userId});

		if (!message) {
			throw new Error (
				`message ${_id} cannot be updated by ${userId}`
			);
		}

		return new Message (
			await message
				.set ('text', text || '')
				.save ()
		);
	}


	async user () {
		const user = await User.getById (this.userId);

		return user ? new User (user) : null;
	}

}

export const messageConnection = connection (Message);