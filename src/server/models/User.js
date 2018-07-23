// @flow

import mongoose from 'mongoose';

import type {MongooseDocument} from 'mongoose';

export type UserMongooseDoc = MongooseDocument & {
	name: string,
	online: boolean
};

const {Schema} = mongoose;

const userSchema = new Schema ({

	name: {
		type: String,
		required: true,
		unique: true,
		index: true
	},

	online: {
		type: Boolean,
		default: false
	}

}, {
	versionKey: false
});

export default mongoose.model ('User', userSchema)