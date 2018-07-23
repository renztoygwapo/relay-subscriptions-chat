// @flow

import React, {Component} from 'react';
import throttle from 'lodash.throttle';


type Direction = 'down' | 'up';

type Props = {
	threshold?: number,
	scrollableId: string,
	onScrollEnd: (position:number) => mixed
};

type State = {
	last: number,
	threshold: number
};

export default class ScrollDirection extends Component<Props, State> {

	_scrollable: Element;

	constructor (props: Props) {
		super (props);

		this.state = {
			last: 0,
			threshold: props.threshold || 200
		};

		(this: any).scrollHandler = throttle (this.scrollHandler, 200).bind (this);
	}


	scrollHandler () {
		const {last, threshold} = this.state;

		const {scrollTop: position} = this._scrollable;
		const direction: ?Direction = ['up', 'down'] [
			Number (position > last)
		];

		if (
			direction === 'up' &&
			position - threshold <= 0
		) {
			this.props.onScrollEnd (position);
		}

		this.setState ({
			last: position
		});
	}

	componentDidMount () {
		const scrollable = document.getElementById (this.props.scrollableId);

		if (scrollable) {
			this._scrollable = scrollable;
			this._scrollable.addEventListener ('scroll', this.scrollHandler);
		}
	}

	componentWillUnmount () {
		if (this._scrollable) {
			this._scrollable.removeEventListener ('scroll', this.scrollHandler);
		}
	}

	render () {
		return (
			<div onClick={this.props.onScrollEnd}/>
		);
	}
}