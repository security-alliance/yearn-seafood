const registry = require('./abi/registry.json');
const vault030 = require('./abi/vault030.json');
const vault035 = require('./abi/vault035.json');
const vault043 = require('./abi/vault043.json');
const strategy = require('./abi/strategy.json');

const compare = require('compare-versions')
const ethers = require('ethers')
//import {SpookySwapRouter, SpiritSwapRouter} from './Addresses';



function GetVaultAbi(version) {
	if(compare.compare(version, '0.3.5', '<')) return vault030;
	if(compare.compare(version, '0.3.5', '=')) return vault035;
	return vault043;
}


async function GetVaultContract(vault, provider, version){
	if(version === undefined) {
		const s = new ethers.Contract(vault, vault043, provider);
		version = await s.apiVersion();
	}
	return new ethers.Contract(vault, GetVaultAbi(version), provider);
}

async function GetBasicVault(address, provider){
	let s = await GetVaultContract(address, provider);
	console.log(s);
	let name = await s.name();
	//console.log(totalAssets)
	//console.log(totalDebt)

	return {
		address: address,
		name: name,
		contract: s
	};
    
}

function GetStrategyContract(address, provider) {
	return new ethers.Contract(address, strategy, provider);	
}

async function GetBasicStrat(address, provider){
	let s = GetStrategyContract(address, provider);
	console.log(s);
	let name = await s.name();
	//console.log(totalAssets)
	//console.log(totalDebt)

	return {
		address: address,
		name: name,
		contract: s
	};
    
}
async function GetVaultInfo(vault, provider){
	const s = await GetVaultContract(vault, provider);
	const name = await s.name();
	const debtRatio = await s.debtRatio();
	const totalAssets = await s.totalAssets();
	const totalDebt = await s.totalDebt();
	const managementFee = await s.managementFee();
	const performanceFee = await s.performanceFee();

	return {
		name: name,
		contract: s,
		address: vault,
		debtRatio,
		totalAssets,
		totalDebt,
		managementFee,
		performanceFee
	};
}

async function StratInfo(vault, strat, provider){

	let s = new ethers.Contract(strat, strategy, provider);
	let params = await vault.strategies(strat);
	//console.log(params)
	// console.log('beforedebt: ', params.totalDebt/totalAssets);
	let genlender = false;
	let delegated = 0;
	try{
		delegated = await s.delegatedAssets();
	}catch(ex){
		//nothing
	}

	let name = 'TBD';
	try {
		name = await s.name();
	} catch(e) {
		console.warn('Calling strategy.name() failed');
		console.warn(e);
	}

	if(name.includes('StrategyLenderYieldOptimiser')){
		let status = await s.lendStatuses();
		console.log(status);
		genlender = status;
	}

	const estimatedTotalAssets = await s.estimatedTotalAssets();
	const isActive = params.debtRatio > 0 || estimatedTotalAssets > 0;

	return {
		name: name,
		contract: s,
		address: strat,
		delegatedAssets: delegated,
		beforeDebt: params.totalDebt,
		beforeGain: params.totalGain,
		beforeLoss: params.totalLoss,
		debtRatio: params.debtRatio,
		lastReport: params.lastReport,
		genlender: genlender,
		estimatedTotalAssets,
		isActive,
	};
    
}






function Registry(provider){
	console.log('registering network', provider.network.name);

	if(provider._network.chainId == 250){
		return new ethers.Contract('0x727fe1759430df13655ddb0731dE0D0FDE929b04', registry, provider);
	}
	return new ethers.Contract('0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804', registry, provider);
	//return new ethers.Contract('0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', registry, provider);
    
}

module.exports = {
	GetVaultInfo,
	StratInfo
}