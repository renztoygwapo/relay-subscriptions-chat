// @flow

import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

import UserPreview from 'components/user/UserPreview';

import HeaderTotalMessages from './HeaderTotalMessages';
import HeaderTotalUsers from './HeaderTotalUsers';
import {logout} from 'components/lib/session';

import type {UserPreviewType} from 'components/user/UserPreview';
import type {HeaderTotalMessagesType} from './HeaderTotalMessages';
import type {HeaderTotalUsersType} from './HeaderTotalUsers';

export type HeaderType = {
	+me: UserPreviewType,
	+stats: HeaderTotalMessagesType & HeaderTotalUsersType
};

type Props = {
	data: HeaderType
};

const Logout = () =>
	<a
		href="#"
		className="logout"
		onClick={(e: Event) => {
			e.preventDefault ();

			logout ().then (() =>
				location.reload ()
			);
		}}>
		<i className="fa fa-sign-out"/>
	</a>


const Header = ({data: {
	me,
	stats
}}: Props) =>
	<header className="app-header">
		<UserPreview data={me}/>

		<div className="stats">
			<HeaderTotalUsers data={stats}/>
			{' / '}
			<HeaderTotalMessages data={stats}/>
			<Logout/>
		</div>
	</header>

export default createFragmentContainer (Header, graphql`
	fragment Header on RootQuery {
		me {
			...UserPreview
		}

		stats {
			...HeaderTotalMessages
			...HeaderTotalUsers
		}
	}`
);
