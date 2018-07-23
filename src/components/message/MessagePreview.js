// @flow

import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

import Controls from 'components/message/MessagePreviewControls';


export type MessagePreviewType = {|
	+id: string,
	+text: string,
	+created: string,
	+user: {
		+id: string,
		+name: string
	}
|};

type Props = {
	owner: boolean,
	data: MessagePreviewType,
	onEditClick: Function,
	onRemoveClick: Function
};


const MessagePreview = ({
	data,
	owner,
	onEditClick,
	onRemoveClick
}: Props) =>
	<div className={`message${owner ? ' own' : ''}`}>
		{owner ? (
			<Controls
				message={data}
				onEditClick={onEditClick}
				onRemoveClick={onRemoveClick}/>
		) : null}

		<div className="info">
			<span>{data.user.name}</span>
			<small>{data.created}</small>
		</div>
		<div className="text">
			<p>{data.text}</p>
		</div>
	</div>

export default createFragmentContainer (MessagePreview, graphql`
	fragment MessagePreview on Message {
		id
		text
		created
		user {
			id
			name
		}
	}`
);