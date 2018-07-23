const name = 'relay-subscriptions-chat';

// name -> https://${name} (see nginx.conf)
// name -> mongodb://localhost:27017/${name}
// name -> index.html -> title

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