// @flow

import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';


export type UserPreviewType = {|
	+id: string,
	+name: string,
	+online: boolean,
	+totalMessages: number
|};

type Props = {
	data: UserPreviewType
};


const UserPreview = ({data}: Props) =>
	<div className="user">
		<span className="username">
			<span className={`status${
				data.online ? ' online' : ''
			}`}>
				<i className="fa fa-circle"/>
			</span>
			{' '}
			{data.name}
		</span>
		{' '}
		<span className="stats">
			{data.totalMessages}
		</span>
	</div>

export default createFragmentContainer (UserPreview, graphql`
	fragment UserPreview on User {
		id
		name
		online
		totalMessages
	}`
);