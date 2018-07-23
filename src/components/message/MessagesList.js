// @flow

import React, {Component} from 'react';
import {createPaginationContainer, graphql} from 'react-relay';


import ScrollHander from 'components/lib/scroll-handler';
import MessagePreview from 'components/message/MessagePreview';
import MessageInput from 'components/message/MessageInput';

import messageAddMutation from 'components/mutations/MessageAdd';
import messageRemoveMutation from 'components/mutations/MessageRemove';
import messageUpdateMutation from 'components/mutations/MessageUpdate';

import type {MessagePreviewType} from 'components/message/MessagePreview';
export type MessagesListType = {|
	+me: {
		id: string
	},
	+messages: ?{|
		+edges: $ReadOnlyArray<{|
			+node: {|
				id: string,
				...MessagePreviewType
			|}
		|}>,
		pageInfo?: Object
	|}
|};

import type {RelayPaginationProp} from 'react-relay';

type Props = {
	relay: RelayPaginationProp,
	data: MessagesListType
};

type State = {
	updating?: boolean,
	editing?: ?string,
	editingText?: ?string
};


class MessagesList extends Component <Props, State> {

	chat: ?HTMLElement;

	constructor (props: Props) {
		super (props);

		this.state = {};

		(this: any).loadMore = this.loadMore.bind (this);

		(this: any).submitMessageInput = this.submitMessageInput.bind (this);
		(this: any).cancelMessageInput = this.cancelMessageInput.bind (this);

		(this: any).editMessage = this.editMessage.bind (this);
		(this: any).removeMessage = this.removeMessage.bind (this);
	}

	componentDidMount () {
		this.scrollBottom ();
	}

	componentDidUpdate (prevProps) {
		if (this.state.updating) {
			return;
		}

		const {messages} = this.props.data;
		const {messages: prevMessages} = prevProps.data;

		if (
			messages &&
			prevMessages &&
			messages.edges.length !==
			prevMessages.edges.length
		) {
			this.scrollBottom ();
		}
	}

	async loadMore () {
		const {relay} = this.props;

		if (!relay.hasMore () || relay.isLoading ()) {
			return;
		}

		this.setState ({updating: true});

		relay.loadMore (6, (error) => {
			if (error) {
				console.error ('pagination fetch error:', error);
			}

			this.setState ({updating: false});
		});
	}

	scrollBottom () {
		if (this.chat) {
			this.chat.scrollTop =
			this.chat.children [0].clientHeight;
		}
	}

	submitMessageInput (text: string) {
		const {editing} = this.state;

		return editing
			? this.updateMessage (editing, text)
			: this.addMessage (text);
	}

	cancelMessageInput () {
		this.setState ({
			editing: null,
			editingText: null
		});
	}

	editMessage (messageId: string, text: string) {
		this.setState ({
			editing: messageId,
			editingText: text
		});
	}

	addMessage (text: string) {
		messageAddMutation (
			this.props.relay.environment,
			{text}
		);
	}

	removeMessage (messageId: string) {
		messageRemoveMutation (
			this.props.relay.environment,
			{messageId}
		);
	}

	updateMessage (messageId, text) {
		messageUpdateMutation (
			this.props.relay.environment,
			{messageId, text}
		);

		this.cancelMessageInput ();
	}

	render () {
		const {data} = this.props;
		const {messages, me} = data || {};
		const {edges} = messages || {};

		if (!edges) {
			return null;
		}

		const {editing, editingText} = this.state;

		return (
			<div className="messages-list">

				<div
					id="scrollable-chat"
					className="chat"
					ref={(chat) => this.chat = chat}>

					<ul>
						{edges.map (({node}) =>
							<li
								key={node.id}
								className={
									editing === node.id
										? 'editing' : ''
								}>
								<MessagePreview
									data={node}
									owner={me.id === node.user.id}
									onEditClick={this.editMessage}
									onRemoveClick={this.removeMessage}/>
							</li>
						)}
					</ul>
					<ScrollHander
						scrollableId="scrollable-chat"
						onScrollEnd={this.loadMore}/>
				</div>

				<MessageInput
					user={me}
					value={editingText}
					onSubmit={this.submitMessageInput}
					onCancel={this.cancelMessageInput}/>
			</div>
		);
	}
}

export default createPaginationContainer (MessagesList, graphql`
	fragment MessagesList on RootQuery
		@argumentDefinitions (
			count: {type: "Int", defaultValue: 12}
			cursor: {type: "String"}
		) {

		me {
			id
		}

		messages (
			first: $count
			after: $cursor
		) @connection (key: "MessagesList_messages") {
			edges {
				node {
					id
					user {
						id
					}
					...MessagePreview
				}
			}
		}
	}`,
	{
		direction: 'forward',
		getConnectionFromProps ({data}) {
			return data && data.messages;
		},
		getVariables (props, {count, cursor}) {
			return {
				count,
				cursor
			};
		},
		query: graphql`
			query MessagesListPaginationQuery (
				$count: Int!
				$cursor: String
			) {
				...MessagesList @arguments (count: $count, cursor: $cursor)
			}
		`
	}
)