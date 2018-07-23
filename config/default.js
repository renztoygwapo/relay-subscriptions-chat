const name = 'relay-subscriptions-chat';

module.exports = {

	name,
	port: 8180,

	devPort: 8190,

	contentBase: '../',

	mongodb: {
		connstr: 'mongodb://localhost:27017/' + name,

		options: {
			autoReconnect: true,
			reconnectInterval: 1000,
			useNewUrlParser: true
		}
	}

};