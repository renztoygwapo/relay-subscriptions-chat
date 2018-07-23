// @flow

import express from 'express';
import render from 'server/html/render';

import type {$Request, $Response} from 'express';


export default express.Router ()

	.use ('*', async (req: $Request, res: $Response) =>
		res.status (200).send (render ())
	);