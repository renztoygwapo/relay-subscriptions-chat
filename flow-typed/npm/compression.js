// @flow

declare module 'compression' {
    import type {Middleware} from 'express';

    declare interface CompressionOptions  {

        /**
         * See https://github.com/expressjs/compression#chunksize regarding the usage.
         */
        chunkSize?: number;

        /**
         * See https://github.com/expressjs/compression#level regarding the usage.
         */
        level?: number;

        /**
         * See https://github.com/expressjs/compression#memlevel regarding the usage.
         */
        memLevel?: number;

        /**
         * See https://github.com/expressjs/compression#strategy regarding the usage.
         */
        strategy?: number;

        /**
         * See https://github.com/expressjs/compression#threshold regarding the usage.
         */
        threshold?: number|string;

        /**
         * See https://github.com/expressjs/compression#windowbits regarding the usage.
         */
        windowBits?: number;

        /**
         * See https://github.com/expressjs/compression#filter regarding the usage.
         */
        filter?: Function;

        /**
         * See https://nodejs.org/api/zlib.html#zlib_class_options regarding the usage.
         */
        flush?: number;

        /**
         * See https://nodejs.org/api/zlib.html#zlib_class_options regarding the usage.
         */
        finishFlush?: number;
    }

    declare export default (options?: CompressionOptions) => Middleware;
}