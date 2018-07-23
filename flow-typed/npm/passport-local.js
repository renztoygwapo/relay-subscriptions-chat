// @flow

import {Strategy as PassportStrategy} from 'passport-strategy';

declare module 'passport-local' {
    import type {$Request} from 'express';

    declare interface IStrategyOptions {
        usernameField?: string;
        passwordField?: string;
        session?: boolean;
        passReqToCallback?: false;
    }

    declare interface IStrategyOptionsWithRequest {
        usernameField?: string;
        passwordField?: string;
        session?: boolean;
        passReqToCallback: true;
    }

    declare interface IVerifyOptions {
        message: string;
    }

    declare interface VerifyFunctionWithRequest {
        (
            req: $Request,
            username: string,
            password: string,
            done: (error: any, user?: any, options?: IVerifyOptions) => void
        ): any;
    }

    declare interface VerifyFunction {
        (
            username: string,
            password: string,
            done: (error: any, user?: any, options?: IVerifyOptions) => void
        ): any;
    }

    declare export class Strategy extends PassportStrategy {
        constructor(
            options: IStrategyOptionsWithRequest,
            verify: VerifyFunctionWithRequest
        ): this;
        constructor(options: IStrategyOptions, verify: VerifyFunction): this;
        constructor(verify: VerifyFunction): this;

        name: string;

        authenticate(req: $Request, options?: any): void;
        success(user: any, info: any): void;
        fail(challenge: any, status: number): void;
        fail(status: number): void;
        redirect(url: string, status?: number): void;

        pass(): void;

        error(err: Error): void;
    }
}

