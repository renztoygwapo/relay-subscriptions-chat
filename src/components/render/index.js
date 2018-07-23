// @flow

import React from 'react';
import QueryRenderer from 'relay-query-lookup-renderer';

import Boundary from './Boundary';
import ErrorComponent from './Error';
import LoaderComponent from 'components/Loader';


import type {
	ReadyState,
	GraphQLTaggedNode,
	Environment as RelayEnv
} from 'react-relay'

import type {
	Environment as RuntimeEnv
} from 'relay-runtime';


type RenderProps = {
	query: GraphQLTaggedNode,
	variables?: Object,
	environment: RelayEnv | RuntimeEnv,
	component: React$ComponentType <*>,
	componentProps?: Object
};

const rootQueryOrFragment = (props: {__id: string}) =>
	props.__id === 'client:root' ? {data: props} : props;

export default ({
	query,
	variables,
	environment,
	component: Component,
	componentProps = {}
}: RenderProps) =>
	<Boundary>
		<QueryRenderer
			lookup
			query={query}
			environment={environment}
			variables={variables}
			render={({error, props}: ReadyState) => {
				if (error) {
					return <ErrorComponent error={error}/>;
				} else if (props) {
					return <Component
						{...rootQueryOrFragment (props)}
						{...componentProps}/>;
				}

				return <LoaderComponent/>;
			}}/>
	</Boundary>
