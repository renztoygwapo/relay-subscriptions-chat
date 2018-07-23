// @flow

import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';


export type HeaderTotalMessagesType = {
	+messages: {
		+total: number
	}
};

type Props = {
	data: HeaderTotalMessagesType
};


const HeaderTotalMessages = ({data}: Props) =>
	<span>{data.messages.total}</span>

export default createFragmentContainer (HeaderTotalMessages, graphql`
	fragment HeaderTotalMessages on Stats {
		messages {
			total
		}
	}`
);
