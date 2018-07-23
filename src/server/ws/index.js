// @flow

import socketIO from 'socket.io';

import {passportMiddleware} from 'server/session';
import SubscriptionSocket from 'server/schema/subscriptions/socket';

import type {Server} from 'http';
import type {Middleware} from 'express';
import type {ServerOptions} from 'socket.io';
import type {Client, SocketContext} from 'server/schema/subscriptions/socket';


const serverOptions = ({
	path: '/ws',
	forceNew: true
}: ServerOptions);


export default (server: Server, sessionMiddleware: Middleware) => {
	const io = socketIO (server, serverOptions);

	io.on ('connection', (client: Client) =>
		new SubscriptionSocket (client)
	);

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

