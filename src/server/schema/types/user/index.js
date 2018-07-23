// @flow

import {offsetToCursor} from 'graphql-relay';


import MongooseUser from 'server/models/user';
import Model from 'server/schema/types/model';
import stats from 'server/schema/types/stats';

import connection from 'server/schema/connection';
import Message, {messageConnection} from 'server/schema/types/message';

import subscriptions from 'server/schema/subscriptions';

import type {ConnectionArguments} from 'graphql-relay';
import type {UserMongooseDoc} from 'server/models/user';
import type {PassportRequest} from 'server/session/passport';

type Variables = {
	name: string
} & ConnectionArguments;


export default class User extends Model {

	_doc: UserMongooseDoc;

	static MongooseModel = MongooseUser;

	static async buildQuery (variables: Variables): Promise <Object> {
		return variables && {};
	}

	static async getFromContext (context: PassportRequest): Promise <Model> {
		if (!context.isAuthenticated ()) {
			throw new Error ('authentication required');
		}

		return new User (
			await this.getById (
				context.session.passport.user.id
			)
		);
	}

	static async findOrCreate (data: Object): Promise <Model> {
		const {MongooseModel} = this;
		let [found] = await MongooseModel.find (data);

		if (found) {
			return new User (found);
		}

		const model = new MongooseModel ({...data, online: true});
		const node = new User (await model.save ());

		const userAdded = {
			stats,
			addedUserEdge: {
				node,
				cursor: offsetToCursor (0)
			}
		};

		subscriptions.publish (
			'UserAddedSubscription',
			{userAdded}
		);

		return node;
	}

	static async updateOnlineStatus (userId: string, online: boolean): Promise <void> {
		const model: UserMongooseDoc = await this.getById (userId);
		const {online: before} = model;

		if (before !== online) {
			await model.set ('online', online).save ();

			const userUpdated = {
				user: new User (model)
			};

			subscriptions.publish (
				'UserUpdatedSubscription',
				{userUpdated}
			);
		}
	}


	async messages (variables: ConnectionArguments) {
		const query = {userId: this._doc._id};

		return messageConnection (query, variables);
	}

	async totalMessages () {
		const query = {userId: this._doc._id};

		return await Message.count (query) || 0;
	}

}

export const userConnection = connection (User);