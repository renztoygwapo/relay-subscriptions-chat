// @flow

import * as mongodb from 'mongodb';
import {Store} from 'express-session';

declare module 'connect-mongo' {

    import type {Middleware} from 'express';
    import type {SessionOptions, Session, SessionData} from 'express-session';
    import type {MongooseConnection, MongooseConnectionOptions} from 'mongoose';

    declare export interface DefaultOptions {

        /**
         * The hostname of the database you are connecting to.
         * (Default: '127.0.0.1')
         */
        host?: string,

        /**
         * The port number to connect to.
         * (Default: 27017)
         */
        port?: string,

        /**
         * (Default: false)
         */
        autoReconnect?: boolean,

        /**
         * (Default: true)
         */
        ssl?: boolean,

        /**
         * (Default: 1)
         */
        w?: number,

        /**
         * The colletion of the database you are connecting to.
         * (Default: sessions)
         */
        collection?: string,

        /**
         * Serialize sessions using JSON.stringify and deserialize them with JSON.parse.
         * (Default: true)
         */
        stringify?: boolean,

        /**
         * Default: false
         */
        hash?: boolean,

        /**
         * Default: 14 days (60 * 60 * 24 * 14)
         */
        ttl?: number,

        /**
         * Automatically remove expired sessions.
         * (Default: 'native')
         */
        autoRemove?: string,

        /**
         * (Default: 10)
         */
        autoRemoveInterval?: number,

        /**
         * don't save session if unmodified
         */
        touchAfter?: number
    }

    declare export interface MongoUrlOptions extends DefaultOptions {
        url: string,
        mongoOptions?: MongooseConnectionOptions
    }

    declare export interface MogooseConnectionOptions extends DefaultOptions {
        mongooseConnection: MongooseConnection
    }

    declare export interface NativeMongoOptions extends DefaultOptions {
        db: mongodb.Db
    }

    declare export interface NativeMongoPromiseOptions extends DefaultOptions {
        dbPromise: Promise<mongodb.Db>
    }

    declare export interface MongoStoreFactory {
        constructor(options: MongoUrlOptions | MogooseConnectionOptions | NativeMongoOptions | NativeMongoPromiseOptions): MongoStore
    }

    declare export class MongoStore extends Store {
        get: (sid: string, callback: (err: any, session?: SessionData | null) => void) => void,
        set: (sid: string, session: Session, callback?: (err?: any) => void) => void,
        destroy: (sid: string, callback?: (err?: any) => void) => void,
        length: (callback: (err: any, length?: number | null) => void) => void,
        clear: (callback?: (err?: any) => void) => void,
        touch: (sid: string, session: Session, callback?: (err?: any) => void) => void
    }

    declare export default function connectMongo (
        connect: (options?: SessionOptions) => Middleware
    ): Class <MongoStoreFactory>
}

