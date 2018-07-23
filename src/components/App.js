// @flow

import React, {Component} from 'react';
import {createFragmentContainer, graphql} from 'react-relay';


import Header from 'components/header/Header';
import MessagesList from 'components/message/MessagesList';
import UsersList from 'components/user/UsersList';

import userAddedSubscription from 'components/subscriptions/UserAdded';
import userUpdatedSubscription from 'components/subscriptions/UserUpdated';
import messageAddedSubscription from 'components/subscriptions/MessageAdded';
import messageRemovedSubscription from 'components/subscriptions/MessageRemoved';
import messageUpdatedSubscription from 'components/subscriptions/MessageUpdated';

import type {
	Disposable
} from 'react-relay';

type Props = {
	data: Object
};

class App extends Component <Props> {

	disposable: Disposable;

	componentDidMount () {
		userAddedSubscription ();
		userUpdatedSubscription ();
		messageAddedSubscription ();
		messageRemovedSubscription ();
		messageUpdatedSubscription ();
	}

	render () {
		const {data} = this.props;

		return (
			<div className="app">
				<Header data={data}/>

				<div className="app-content">
					{/* $FlowFixMe https://github.com/facebook/relay/issues/2316 */}
					<MessagesList data={data}/>

					{/* $FlowFixMe https://github.com/facebook/relay/issues/2316 */}
					<UsersList data={data}/>
				</div>
			</div>
		);
	}
}

export default createFragmentContainer (App, graphql`
	fragment App on RootQuery {
		...Header
		...MessagesList
		...UsersList
	}`
);