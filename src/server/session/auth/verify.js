// @flow

import User from 'server/schema/types/user';

// STUB: allow immediate creation
// or take control by name only

export default async (name: string, password: string) => {
	if (name && password) {
		const {_doc: {_id: id}} = await User.findOrCreate ({name});

		console.log (`* creating session for ${name}`);

		return {id, name};
	}
}