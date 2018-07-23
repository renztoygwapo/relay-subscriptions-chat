// @flow

import passport from 'passport';

import localStrategy from './auth';


import type {$Request} from 'express';

export type PassportUser = {
	id: string,
	name: string
};

export type PassportSession = {
	passport: {
		user: PassportUser
	}
};

export type PassportRequest = $Request & {
	session: PassportSession,
	isAuthenticated (): boolean,
	login (user: PassportUser, callback: Function): void,
	logout (): void
};


passport
	.serializeUser ((user: PassportUser, cb) =>
		cb (null, user)
	);

passport
	.deserializeUser ((user: PassportUser, cb) =>
		cb (null, user)
	);

passport
	.use (localStrategy);

export default passport;