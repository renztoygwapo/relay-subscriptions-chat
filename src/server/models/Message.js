// @flow

import mongoose from 'mongoose';

import type {MongoId, MongooseDocument} from 'mongoose';

export type MessageMongooseDoc = MongooseDocument & {
    userId: MongoId,
    text: string
};

const {Schema} = mongoose;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema ({
    userId: {
        type: ObjectId,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

export default mongoose.model ('Message', messageSchema)