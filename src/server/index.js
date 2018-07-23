// @flow

import 'babel-polyfill';
import 'isomorphic-fetch';

import path from 'path';
import config from 'config';

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import graphqlHTTP  from 'express-graphql';
import {graphqlBatchHTTPWrapper}  from 'react-relay-network-modern';

import connectMongo from 'connect-mongo';
import session from 'express-session';

import cors from 'server/cors';
import html from 'server/html';
import connectDb from 'server/db';
import {schema, rootValue} from 'server/schema';
import appSession, {passportMiddleware} from 'server/session';

import wsServer from 'server/ws';

const {
    name,
    port,
    contentBase
}: {
    name: string,
    port: string,
    contentBase: string
} = config;

const PUBLIC_PATH = path.resolve (__dirname, contentBase);
const MongoStore = connectMongo (session);
const graphqlServer = graphqlHTTP ({
    schema,
    rootValue,
    pretty: true
});

(async (app) => {

    const mongooseConnection = await connectDb ();

    const sessionMiddleware = session ({
        resave: true,
        saveUninitialized: true,
        secret: 'secret do not tell',
        store: new MongoStore ({mongooseConnection})
    });

    const expressServer = app
        .use (cors)
        .use (compression ())

        .use (sessionMiddleware)
        .use (passportMiddleware)

        .use (bodyParser.urlencoded ({
            extended: true
        }))
        .use (bodyParser.json ())
        .use (express.static (PUBLIC_PATH))

        .use ('/session', appSession)
        .use ('/graphql/batch', graphqlBatchHTTPWrapper (graphqlServer))
        .use ('/graphql', graphqlServer)
        .get ('*', html)

        .listen (port, () => {
            console.log (`* ${name} express server started on port ${port}`);
            console.log (`* ${name} mongoose connected to ${mongooseConnection.port}/${mongooseConnection.name}`);
            console.log (`* ${name} graphql server running on ${port}/graphql`);
            console.log (`* ${name} subscriptions server running on ${port}${subscriptionsServer.server.path ()}`);
        });

    const subscriptionsServer = wsServer (expressServer, sessionMiddleware);

}) (express ());

