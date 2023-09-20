import React, {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import * as Comlink from 'comlink';
import * as Seafood from './types';
import {api} from './worker/index';
import {hydrateBigNumbersRecursively} from '../../utils/utils';
import useLocalStorage from 'use-local-storage';
import {RefreshStatus} from './worker/types';

interface VaultsContext {
	refreshing: boolean,
	cachetime: Date,
	vaults: Seafood.Vault[],
	status: RefreshStatus[],
	ytvl: number,
	refresh: () => void
}

function useWorker() {
	return useMemo(() => {
		if(typeof SharedWorker !== 'undefined') {
			const worker = new SharedWorker(new URL('./worker/shared.ts', import.meta.url));
			return Comlink.wrap<typeof api>(worker.port);
		} else {
			const worker = new Worker(new URL('./worker/isolated.ts', import.meta.url));
			return Comlink.wrap<typeof api>(worker);
		}
	}, []);
}

const	vaultsContext = createContext<VaultsContext>({} as VaultsContext);
export const useVaults = () => useContext(vaultsContext);
export default function VaultsProvider({children}: {children: ReactNode}) {
	const [refreshing, setRefreshing] = useState(false);
	const [cachetime, setCachetime] = useLocalStorage<Date>('context/usevaults/cachetime', new Date(0), {
		parser: str => new Date(JSON.parse(str))
	});
	const [vaults, setVaults] = useState<Seafood.Vault[]>([]);
	const [status, setStatus] = useState<RefreshStatus[]>([]);
	const worker = useWorker();
	
	// console.log('VaultsProvider', {refreshing, cachetime, vaults, status});

	const callback = useMemo(() => {
		return {
			onRefresh: () => {
				console.log('onRefresh');
				setRefreshing(true);
			},
			onStatus: (status: RefreshStatus[]) => {
				// console.log('onStatus', status);
				setStatus(status);
			},
			onVaults: (vaults: Seafood.Vault[]) => {
				console.log('onVaults', vaults);
				hydrateBigNumbersRecursively(vaults);
				setVaults(vaults);
			},
			onRefreshed: (date: Date) => {
				console.log('onRefreshed', date);
				setCachetime(date);
				setRefreshing(false);
			},
			onLog: (message: any) => {
				console.log('onLog', message);
			}
		};
	}, [setCachetime]);

	useEffect(() => {
		const callbackProxy = Comlink.proxy(callback);
		worker.pushCallback(callbackProxy);

		if(process.env.NODE_ENV === 'development') {
			worker.ahoy().then(result => console.log(result));
		}

		console.log('Requesting Vaults');
		worker.requestStatus();
		worker.requestVaults();
		worker.isRefreshing().then(result => setRefreshing(result));
		worker.isRunning().then(result => {
			// if(!result) worker.start({refreshInterval: 5 * 60 * 1000});
			console.log('starting outer');
			if(!result) worker.start({refreshInterval: 60 * 1000});
		});

		return () => {
			console.log('removing callback');
			worker.removeCallback(callbackProxy);
		};
	}, [worker, callback]);

	const refresh = useCallback(() => {
		console.log('refreshing');
		worker.refresh();
	}, [worker]);

	const ytvl = useMemo(() => {
		return vaults
			.map(v => v.tvls ? v.tvls.tvls.slice(-1)[0] : 0)
			.reduce((a, b) => a + b, 0);
	}, [vaults]);

	return <vaultsContext.Provider value={{
		refreshing,
		cachetime,
		vaults,
		status,
		ytvl,
		refresh
	}}>{children}</vaultsContext.Provider>;
}
