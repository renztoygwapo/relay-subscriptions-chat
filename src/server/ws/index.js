// @flow

import socketIO from 'socket.io';

import {passportMiddleware} from 'server/session';
import createSubscriptionSocket from './socket/subscription';
import createUserSocket from './socket/user';

import type {Server} from 'http';
import type {Middleware} from 'express';
import type {ServerOptions} from 'socket.io';
import type {Client, SocketContext} from './socket/authenticated';


const serverOptions = ({
	path: '/ws',
	forceNew: true
}: ServerOptions);


export default (server: Server, sessionMiddleware: Middleware) => {
	const io = socketIO (server, serverOptions);

	io.on ('connection', (client: Client) => {
		createUserSocket (client);
		createSubscriptionSocket (client);
	});

	return io
		.use (({request}: SocketContext, next) =>
			// $FlowFixMe http.IncomingMessage / express$Request
			sessionMiddleware (request, request.res, next)
		)
		.use (({request}: SocketContext, next) =>
			// $FlowFixMe http.IncomingMessage / express$Request
			passportMiddleware (request, request.res, next)
		);
}

