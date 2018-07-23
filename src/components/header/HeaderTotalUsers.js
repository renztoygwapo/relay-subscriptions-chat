// @flow

import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';


export type HeaderTotalUsersType = {
	+users: {|
		+total: number
	|}
};

type Props = {
	data: HeaderTotalUsersType
};


const HeaderTotalUsers = ({data}: Props) =>
	<span>{data.users.total}</span>

export default createFragmentContainer (HeaderTotalUsers, graphql`
	fragment HeaderTotalUsers on Stats {
		users {
			total
		}
	}`
);
