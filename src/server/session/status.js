// @flow

import User from 'server/schema/types/user';

import type {$Response, NextFunction} from 'express';
import type {PassportRequest} from './passport';

export default async (
	req: PassportRequest,
	res: $Response,
	next: NextFunction
) => {
	if (req.isAuthenticated ()) {
		await User.updateOnlineStatus (
			req.session.passport.user.id,
			true
		);
	}

	next ();
};