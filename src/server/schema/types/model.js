// @flow

import mongoose from 'mongoose';
import {fromGlobalId, toGlobalId} from 'graphql-relay';


import type {
	MongooseDocument,
	MongooseModel
} from 'mongoose';


const {ObjectId} = mongoose.Types;

export default class Model {

	id: string;
	$key: string;
	$value: mixed;

	_doc: MongooseDocument;

	static MongooseModel: MongooseModel;

	static async count (query: ?Object) {
		return await this.MongooseModel.countDocuments (query || {});
	}

	static async getById (id: string) {
		const modelId = ObjectId.isValid (id) ? id : fromGlobalId (id).id;

		// $FlowFixMe mongoose query promise / mongoose doc
		const doc: ?MongooseDocument = await this.MongooseModel.findById (modelId);

		if (!doc) {
			throw new Error (`user not found by ${modelId}`);
		}

		return doc;
	}

	constructor (doc: MongooseDocument) {
		this._doc = doc;

		return new Proxy (this, {
			get (target, prop) {
				if (prop === 'id') {
					return toGlobalId (
						doc.constructor.modelName,
						doc.id.toString ()
					);
				}

				return typeof target [prop] !== 'undefined'
					? target [prop]
					: (doc: Object) [prop];
			}
		});
	}

}