// @flow

import {
	cursorToOffset,
	connectionFromArraySlice
} from 'graphql-relay';


import type {ConnectionArguments} from 'graphql-relay';
import Model from './types/model';


export default (T: Class <Model>) =>
	async (
		query: Object,
		variables: ConnectionArguments
	) => {
		const {first: limit, after} = variables;
		const offset = after ? cursorToOffset (after) : 0;

		const count: number = await T.count (query);
		const data: Array <Object> = await T
			.MongooseModel
			.find (query)
			.sort ({created: -1})
			.skip (offset)
			.limit (limit || 1);

		const connection = connectionFromArraySlice (
			data.map ((doc) => new T (doc)),
			variables,
			{
				sliceStart: offset,
				arrayLength: count
			}
		);

		return {...connection};
	};
