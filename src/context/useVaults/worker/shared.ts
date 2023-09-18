declare const self: SharedWorkerGlobalScope; // chrome://inspect/#workers
import * as Comlink from 'comlink';
import {api} from './index';

self.onconnect = (event: MessageEvent): void => {
	console.log('Shared worker connected');
	const port = event.ports[0];
	Comlink.expose(api, port);
};

export {api};