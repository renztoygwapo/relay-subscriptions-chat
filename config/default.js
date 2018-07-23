const name = 'relay-subscriptions-chat';

/* eslint-disable no-process-env */
const port = process.env.PORT || 8180;
const connstr = process.env.MONGODB_URI || 'mongodb://localhost:27017/' + name;
/* eslint-enable no-process-env */

module.exports = {

	name,
	port,

	devPort: 8190,

	contentBase: '../',

	mongodb: {
		connstr,

		options: {
			autoReconnect: true,
			reconnectInterval: 5000,
			useNewUrlParser: true
		}
	}

};