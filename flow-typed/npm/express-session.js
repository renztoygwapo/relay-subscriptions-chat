// @flow

declare module 'express-session' {
    import type {CookieOptions, Middleware} from 'express';

    declare interface Request {
        session?: Session,
        sessionID?: string
    }

    declare export interface SessionData {
        [key: string]: any,
        cookie: SessionCookieData
    }

    declare interface SessionCookieData {
        originalMaxAge: number,
        path: string,
        maxAge: number | null,
        secure?: boolean,
        httpOnly: boolean,
        domain?: string,
        expires: Date | boolean,
        sameSite?: boolean | string
    }

    declare type SessionCookie = {
        serialize(name: string, value: string): string
    } & SessionCookieData;

    declare export type Session = {
        id: string,
        regenerate(callback: (err: any) => void): void,
        destroy(callback: (err: any) => void): void,
        reload(callback: (err: any) => void): void,
        save(callback: (err: any) => void): void,
        touch(callback: (err: any) => void): void,
        cookie: SessionCookie
    } & SessionData;

    declare export type SessionOptions = {
        secret: string | string [],
        name?: string,
        store?: Store | MemoryStore,
        cookie?: CookieOptions,
        genid?: (req: Request) => string,
        rolling?: boolean,
        resave?: boolean,
        proxy?: boolean,
        saveUninitialized?: boolean,
        unset?: string
    };

    declare interface BaseMemoryStore {
        get: (
            sid: string,
            callback: (err: any, session?: SessionData | null) => void
        ) => void,
        set: (sid: string, session: Session, callback?: (err?: any) => void) => void,
        destroy: (sid: string, callback?: (err?: any) => void) => void,
        length?: (callback: (err: any, length?: number | null) => void) => void,
        clear?: (callback?: (err?: any) => void) => void
    }

    declare export class Store {
        constructor (config?: any): this,
        regenerate: (req: Request, fn: (err?: any) => any) => void,
        load: (sid: string, fn: (err: any, session?: Session | null) => any) => void,
        createSession: (req: Request, sess: SessionData) => void,
        get: (
            sid: string,
            callback: (err: any, session?: SessionData | null) => void
        ) => void,
        set: (sid: string, session: Session, callback?: (err?: any) => void) => void,
        destroy: (sid: string, callback?: (err?: any) => void) => void,
        all: (
            callback: (err: any, obj?: {
                [sid: string]: SessionData
            } | null) => void
        ) => void,
        length: (callback: (err: any, length?: number | null) => void) => void,
        clear: (callback?: (err?: any) => void) => void,
        touch: (sid: string, session: Session, callback?: (err?: any) => void) => void
    }

    declare class MemoryStore {
        get: (
            sid: string,
            callback: (err: any, session?: SessionData | null) => void
        ) => void,
        set: (sid: string, session: Session, callback?: (err?: any) => void) => void,
        destroy: (sid: string, callback?: (err?: any) => void) => void,
        all: (
            callback: (err: any, obj?: {
                [sid: string]: Session
            } | null) => void
        ) => void,
        length: (callback: (err: any, length?: number | null) => void) => void,
        clear: (callback?: (err?: any) => void) => void,
        touch: (sid: string, session: Session, callback?: (err?: any) => void) => void
    }

    declare export default function session (options?: SessionOptions): Middleware;
}