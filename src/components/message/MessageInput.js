// @flow

import React, {Component} from 'react';

type Props = {|
	user: {
		id: string
	},
	value: ?string,
	onSubmit: (text: string) => mixed,
	onCancel: () => mixed
|};


type State = {
	value?: ?string
};

export default class MessageInput extends Component <Props, State> {

	input: ?HTMLElement;

	constructor (props: Props) {
		super (props);

		this.state = {
			value: ''
		};

		(this: any).onInputChange = this.onInputChange.bind (this);
		(this: any).onInputKeyDown = this.onInputKeyDown.bind (this);
	}

	componentDidUpdate ({value: newValue}: Props) {
		const {value} = this.props;

		if (
			this.input &&
			value &&
			value !== newValue
		) {
			this.input.focus ();
			this.setState ({value});
		}
	}

	onInputChange ({target}: SyntheticInputEvent <EventTarget>) {
		const {value} = target;

		this.setState ({value});
	}

	onInputKeyDown (e: SyntheticKeyboardEvent <EventTarget>) {
		if (e.key === 'Enter') {
			e.preventDefault ();
			e.stopPropagation ();

			const {value} = this.state;
			const text = (value || '').trim ();

			if (text) {
				this.props.onSubmit (text);
				this.setState ({value: ''});
			}
		} else if (e.key === 'Escape') {
			e.preventDefault ();
			e.stopPropagation ();

			this.props.onCancel ();
			this.setState ({value: ''});
		}
	}

	render () {
		const {value} = this.state;

		return (
			<div className="message-input">
				<input
					ref={(input) =>
						this.input = input
					}
					required
					value={value}
					onChange={this.onInputChange}
					onKeyDown={this.onInputKeyDown}
					className="form-control"
					placeholder="enter message..."
					autoComplete="off"
					type="text"/>
			</div>
		);
	}

}