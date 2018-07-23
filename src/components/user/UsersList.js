// @flow

import React, {Component} from 'react';
import {createPaginationContainer, graphql} from 'react-relay';

import ScrollHander from 'components/lib/scroll-handler';
import UserPreview from 'components/user/UserPreview';

import type {RelayPaginationProp} from 'react-relay';
import type {UserPreviewType} from 'components/user/UserPreview';

export type UsersListType = {|
	+users: ?{|
		+edges: $ReadOnlyArray<{|
			+node: {|
				+id: string,
				...UserPreviewType
			|}
		|}>,
		pageInfo?: Object
	|}
|};

type Props = {
	relay: RelayPaginationProp,
	data: UsersListType
};


class UsersList extends Component<Props> {

	constructor (props: Props) {
		super (props);

		(this: any).loadMore = this.loadMore.bind (this);
	}

	loadMore () {
		const {relay} = this.props;

		if (!relay.hasMore () || relay.isLoading ()) {
			return;
		}

		relay.loadMore (25, (error) => {
			if (error) {
				console.error ('pagination fetch error:', error);
			}
		});
	}

	render () {
		const {data} = this.props;
		const {users} = data || {};
		const {edges} = users || {};

		if (!edges) {
			return null;
		}

		return (
			<div id="scrollable-users" className="users-list">
				<ul>
					{edges.map (({node}) =>
						<li key={node.id}>
							<UserPreview data={node}/>
						</li>
					)}
				</ul>
				<ScrollHander
					scrollableId="scrollable-users"
					onScrollEnd={this.loadMore}/>
			</div>
		);
	}
}

export default createPaginationContainer (UsersList, graphql`
	fragment UsersList on RootQuery
		@argumentDefinitions (
			count: {type: "Int", defaultValue: 10}
			cursor: {type: "String"}
		) {

		users (
			first: $count
			after: $cursor
		) @connection (key: "UsersList_users") {
			edges {
				node {
					id
					...UserPreview
				}
			}
		}
	}`,
	{
		direction: 'forward',
		getConnectionFromProps ({data}) {
			return data && data.users;
		},
		getVariables (props, {count, cursor}) {
			return {
				count,
				cursor
			};
		},
		query: graphql`
			query UsersListPaginationQuery (
				$count: Int!
				$cursor: String
			) {
				...UsersList @arguments (count: $count, cursor: $cursor)
			}
		`
	}
)