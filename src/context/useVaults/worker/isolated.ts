import * as Comlink from 'comlink';
import {api} from './index';

console.log('Isolated worker connected');
Comlink.expose(api);

export {api};