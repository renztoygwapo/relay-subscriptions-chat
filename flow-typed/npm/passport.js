// @flow

declare module 'passport' {
    import type {$Request, Middleware} from 'express';

    declare interface Request {
        authInfo?: any;
        user?: User;

        // These declarations are merged into express's Request type
        login(user: any, done: (err: any) => void): void;
        login(user: any, options: any, done: (err: any) => void): void;
        logIn(user: any, done: (err: any) => void): void;
        logIn(user: any, options: any, done: (err: any) => void): void;

        logout(): void;
        logOut(): void;

        isAuthenticated(): boolean;
        isUnauthenticated(): boolean;
    }

    declare interface User {
        [_: string]: any;
    }

    declare interface AuthenticateOptions {
        authInfo?: boolean;
        assignProperty?: string;
        failureFlash?: string | boolean;
        failureMessage?: boolean | string;
        failureRedirect?: string;
        failWithError?: boolean;
        session?: boolean;
        scope?: string | string[];
        successFlash?: string | boolean;
        successMessage?: boolean | string;
        successRedirect?: string;
        successReturnToOrRedirect?: string;
        pauseStream?: boolean;
        userProperty?: string;
        passReqToCallback?: boolean;
    }

    declare interface Authenticator <InitializeRet = Middleware, AuthenticateRet = Middleware, AuthorizeRet = AuthenticateRet> {
        use(strategy: Strategy): Authenticator <InitializeRet, AuthenticateRet, AuthorizeRet>;
        use(name: string, strategy: Strategy): Authenticator <InitializeRet, AuthenticateRet, AuthorizeRet>;
        unuse(name: string): Authenticator <InitializeRet, AuthenticateRet, AuthorizeRet>;
        framework<X, Y, Z>(fw: Framework<X, Y, Z>): Authenticator<X, Y, Z>;

        initialize(options?: { userProperty: string; }): InitializeRet;
        session(options?: { pauseStream: boolean; }): AuthenticateRet;

        authenticate(strategy: string | string[], callback?: (...args: any[]) => any): AuthenticateRet;
        authenticate(strategy: string | string[], options: AuthenticateOptions, callback?: (...args: any[]) => any): AuthenticateRet;

        authorize(strategy: string | string[], callback?: (...args: any[]) => any): AuthorizeRet;
        authorize(strategy: string | string[], options: any, callback?: (...args: any[]) => any): AuthorizeRet;

        serializeUser<TUser, TID>(fn: (user: TUser, done: (err: any, id?: TID) => void) => void): void;
        deserializeUser<TUser, TID>(fn: (id: TID, done: (err: any, user?: TUser) => void) => void): void;

        transformAuthInfo(fn: (info: any, done: (err: any, info: any) => void) => void): void;
    }

    declare interface PassportStatic extends Authenticator<Middleware, Middleware, Middleware> {
        Authenticator: { new(): Authenticator<Middleware, Middleware, Middleware> };
        Passport: Authenticator<Middleware, Middleware, Middleware>;
        Strategy: { new(): Strategy & StrategyCreatedStatic };
    }

    declare export interface Strategy {
        name?: string,
        authenticate (
            Strategy: StrategyCreated<Strategy>,
            req: $Request,
            options?: any
        ): any
    }

    declare interface StrategyCreatedStatic {

        /**
         * Authenticate `user`, with optional `info`.
         *
         * Strategies should call this function to successfully authenticate a
         * user.  `user` should be an Object supplied by the application after it
         * has been given an opportunity to verify credentials.  `info` is an
         * optional argument containing additional user information.  This is
         * useful for third-party authentication strategies to pass profile
         * details.
         */
        success (user: Object, info?: Object): void;

        /**
         * Fail authentication, with optional `challenge` and `status`, defaulting
         * to 401.
         *
         * Strategies should call this function to fail an authentication attempt.
         */
        fail(challenge?: string | number, status?: number): void;

        /**
         * Redirect to `url` with optional `status`, defaulting to 302.
         *
         * Strategies should call this function to redirect the user (via their
         * user agent) to a third-party website for authentication.
         */
        redirect(url: string, status?: number): void;

        /**
         * Pass without making a success or fail decision.
         *
         * Under most circumstances, Strategies should not need to call this
         * function.  It exists primarily to allow previous authentication state
         * to be restored, for example from an HTTP session.
         */
        pass(): void;

        /**
         * Internal error while performing authentication.
         *
         * Strategies should call this function when an internal error occurs
         * during the process of performing authentication; for example, if the
         * user directory is not available.
         */
        error(err: any): void;
    }

    declare type StrategyCreated<T, O = T & StrategyCreatedStatic> = $ObjMap<O, () => O>;

    declare interface Profile {
        provider: string;
        id: string;
        displayName: string;
        username?: string;
        name?: {
            familyName: string;
            givenName: string;
            middleName?: string;
        };
        emails?: Array<{
            value: string;
            type?: string;
        }>;
        photos?: Array<{
            value: string;
        }>;
    }

    declare interface Framework <InitializeRet = any, AuthenticateRet = any, AuthorizeRet = AuthenticateRet> {
        initialize(passport: Authenticator<InitializeRet, AuthenticateRet, AuthorizeRet>, options?: any): (...args: any[]) => InitializeRet,
        authenticate(
            passport: Authenticator<InitializeRet, AuthenticateRet, AuthorizeRet>,
            name: string,
            options?: any,
            callback?: (...args: any[]) => any
        ): (...args: any[]) => AuthenticateRet,
        authorize(
            passport: Authenticator<InitializeRet, AuthenticateRet, AuthorizeRet>,
            name: string,
            options?: any,
            callback?: (...args: any[]) => any
        ): ((...args: any[]) => AuthorizeRet)
    }

    declare export default PassportStatic;
}