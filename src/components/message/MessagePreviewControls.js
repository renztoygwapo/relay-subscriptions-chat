// @flow

import React from 'react';

import type {MessagePreviewType} from './MessagePreview';

type Props = {
	message: MessagePreviewType,
	onEditClick: (id: string, text: string) => void,
	onRemoveClick: (id: string) => void
};

const EditMessage = ({onClick}) =>
	<a
		href="#"
		className="edit"
		onClick={(e: Event) => {
			onClick ();
			e.preventDefault ();
		}}>
		<i className="fa fa-pencil"/>
	</a>

const RemoveMessage = ({onClick}) =>
	<a
		href="#"
		className="remove"
		onClick={(e: Event) => {
			onClick ();
			e.preventDefault ();
		}}>
		<i className="fa fa-times"/>
	</a>

export default ({
	message,
	onEditClick,
	onRemoveClick
}: Props) =>
	<div className="controls">
		<EditMessage onClick={() => onEditClick (message.id, message.text)}/>
		<RemoveMessage onClick={() => onRemoveClick (message.id)}/>
	</div>