// @flow

type CallbacksMap = {
	[key: string]: Array <Function>
};

interface iPubSub {
	_callbacks: CallbacksMap,

	publish (name: string, ...data: Array <any>): any,

	subscribe (name: string, cb: Function): any,
	unsubscribe (name: string, cb: Function): any
}

export default class PubSub implements iPubSub {

	_callbacks: CallbacksMap;

	constructor () {
		this._callbacks = {};
	}

	subscribe (name: string, cb: Function) {
		if (!this._callbacks [name]) {
			this._callbacks [name] = [cb];
		} else {
			this._callbacks [name].push (cb);
		}
	}

	unsubscribe (name: string, cb: Function) {
		const callbacks = this._callbacks [name];

		if (callbacks && callbacks.length) {
			const index = this._callbacks [name].indexOf (cb);

			if (index !== -1) {
				this._callbacks [name].splice (index, 1);
			}
		}
	}

	publish (name: string, ...data: Array <any>) {
		const callbacks = this._callbacks [name];

		if (callbacks && callbacks.length) {
			callbacks.forEach (
				(cb) => typeof cb === 'function' && cb (...data)
			);
		}
	}

}
