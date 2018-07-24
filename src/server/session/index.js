// @flow

import express from 'express';


import passport from './passport';
import {authenticate as authenticateLocal} from './auth';
import onlineStatusMiddleware from './status';

import type {$Response} from 'express';
import type {PassportRequest} from './passport';


export const passportMiddleware = express.Router ()
	.use (passport.initialize ())
	.use (passport.session ())
	.use (onlineStatusMiddleware);


export default express.Router ()

	.post ('/', authenticateLocal)

	.get ('/', async (req: PassportRequest, res: $Response) => {
		if (req.isAuthenticated ()) {
			res.json (req.session.passport.user);
		} else {
			res.status (401).json ({
				error: '401',
				message: 'authentication required'
			});
		}
	})

	.delete ('/', (req: PassportRequest, res: $Response) => {
		req.logout ();

		res.json ({
			signout: true
		});
	});