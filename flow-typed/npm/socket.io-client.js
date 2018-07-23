// @flow

declare module 'socket.io-client' {
  declare type Callback = (...args: any[]) => void;

  declare type ManagerOptions = $Shape<{
    path: string,
    reconnection: boolean,
    reconnectionAttempts: number,
    reconnectionDelay: number,
    reconnectionDelayMax: number,
    randomizationFactor: number,
    timeout: number,
    transports: ("polling" | "websocket")[],
    autoConnect: boolean,
    query: { [string]: string },
    parser: any
  }>;

  declare type SocketOptions = $Shape<{
    query: string
  }>;

  declare class Emitter<T> {
    on(event: string, cb: Callback): T;
    addEventListener(event: string, cb: Callback): T;
    once(event: string, cb: Callback): T;
    off(event: string, cb: Callback): T;
    removeListener(event: string, cb: Callback): T;
    removeAllListeners(event: string, cb: Callback): T;
    removeEventListener(event: string, cb: Callback): T;
    emit(event: string, payload: mixed): T;
    listeners(event: string): Callback[];
    hasListeners(event: string): boolean;
  }

  declare export class Manager extends Emitter<Manager> {
    constructor(uri?: string, opts?: ManagerOptions): Manager;
    opts: ManagerOptions;
    reconnection(boolean): Manager;
    reconnectionAttempts(number): Manager;
    reconnectionDelay(number): Manager;
    randomizationFactor(number): Manager;
    reconnectionDelayMax(number): Manager;
    timeout(number): Manager;
    open(fn?: (err?: Error) => void): Manager;
    connect(fn?: (err?: Error) => void): Manager;
    socket(namespace: string, opts?: SocketOptions): Socket;
  }

  declare export class Socket extends Emitter<Socket> {
    id: string;
    constructor(io: Manager, nsp: string, opts?: SocketOptions): Socket;
    open(): Socket;
    connect(): Socket;
    send(...args: any[]): Socket;

    connected: boolean;

    // overrides Emitter#emit
    emit(event: string, ...args: any[]): Socket;

    close(): Socket;
    disconnect(): Socket;
    compress(boolean): Socket;
    io: Manager;
  }

  // all of ManagerOptions with a few additions
  declare type LookupOptions = $Shape<
    {
      forceNew: boolean,
      "force new connection": true,
      multiplex: boolean
    } & ManagerOptions
  >;

  declare type Lookup = (uri?: string, opts?: LookupOptions) => Socket;

  declare export var protocol: 4;
  declare export var connect: Lookup;
  declare export default Lookup
}