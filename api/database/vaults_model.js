const ethers = require('ethers')
const { Multicall } = require('ethereum-multicall')
const vaultRegistryAbi = require('./abi/registryadapter.json')
const strategiesHelperAbi = require('./abi/strategieshelper.json')
const vault043 = require('./abi/vault043.json')
// const vaultRegistryAbi = [
//     'function assetDynamic(address) view returns (tuple(address id, string typeId, address tokenId, uint256 amount, uint256 amountUsdc, uint256 pricePerShare, bool migrationAvailable, address latestVaultAddress, uint256 depositLimit, bool emergencyShutdown))',
//     'function assetStatic(address) view returns (tuple(address id, string typeId, address tokenId, string name, string version, string symbol, uint8 decimals))',
// ]

// const strategiesHelperAbi = [
//     'function assetStrategiesAddresses(address) view returns (address[])',
//     'function assetStrategies(address) view returns (tuple(string name, string apiVersion, address strategist, address rewards, address vault, address keeper, address want, bool emergencyExit, bool isActive, uint256 delegatedAssets, uint256 estimatedTotalAssets)[])',
// ]

const vaultRegistryAddress = '0x240315db938d44bb124ae619f5Fd0269A02d1271'
const strategyRegistryAddress = '0xae813841436fe29b95a14AC701AFb1502C4CB789'

const vaultAddresses = [
    '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE',
    '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
    '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    '0x3B27F92C0e212C671EA351827EDF93DB27cc0c65',
]

const getVaults = async () => {
    return new Promise(async function (resolve, reject) {
        const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URI_FOR_1`])
        const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true })

        // const strategiesRegistry = new ethers.Contract(strategyRegistryAddress, strategiesHelperAbi, provider)
        // const vaultsRegistry = new ethers.Contract(vaultRegistryAddress, vaultRegistryAbi, provider)

        const vaults = []

        const vaultRegistryMulticalls = vaultAddresses.map((vaultAddress) => ({
            reference: `${vaultAddress}-vaults`,
            contractAddress: vaultRegistryAddress,
            abi: vaultRegistryAbi,
            calls: [
                { reference: 'vaultStaticInfo', methodName: 'assetStatic', methodParameters: [vaultAddress] },
                { reference: 'vaultAssets', methodName: 'assetDynamic', methodParameters: [vaultAddress] },
            ],
        }))
        const strategyRegistryMulticalls = vaultAddresses.map((vaultAddress) => ({
            reference: `${vaultAddress}-strategies`,
            contractAddress: strategyRegistryAddress,
            abi: strategiesHelperAbi,
            calls: [
                { reference: 'strategyAddresses', methodName: 'assetStrategiesAddresses', methodParameters: [vaultAddress] },
                { reference: 'strategies', methodName: 'assetStrategies', methodParameters: [vaultAddress] },
            ],
        }))

        const vaultInfoMulticalls = vaultAddresses.map((vaultAddress) => ({
            reference: `${vaultAddress}-vaultInfo`,
            contractAddress: vaultAddress,
            abi: vault043,
            calls: [
                { reference: 'totalDebt', methodName: 'totalDebt', methodParameters: [] },
                { reference: 'debtRatio', methodName: 'debtRatio', methodParameters: [] },
                { reference: 'managementFee', methodName: 'managementFee', methodParameters: [] },
                { reference: 'performanceFee', methodName: 'performanceFee', methodParameters: [] },
            ],
        }))

        const multicalls = [...vaultRegistryMulticalls, ...strategyRegistryMulticalls, ...vaultInfoMulticalls]
        const multicallResults = (await multicall.call(multicalls)).results

        const strategyInfoMulticalls = vaultAddresses
            .map((vaultAddress) => {
                const strategyAddresses = multicallResults[`${vaultAddress}-strategies`].callsReturnContext[0].returnValues
                return strategyAddresses.map((strategyAddress, i) => ({
                    reference: `${vaultAddress}-${strategyAddress}-strategyInfo`,
                    contractAddress: vaultAddress,
                    abi: vault043,
                    calls: [
                        { reference: 'strategies', methodName: 'strategies', methodParameters: [strategyAddress] },
                        { reference: 'queue', methodName: 'withdrawalQueue', methodParameters: [i] },
                    ],
                }))
            })
            .flat()

        const strategyInfoMulticallResults = (await multicall.call(strategyInfoMulticalls)).results

        for (let j = 0; j < vaultAddresses.length; j++) {
            const vaultAddress = vaultAddresses[j]
            console.log('vaultAddress', vaultAddress)
            try {
                const vaultStaticInfo = multicallResults[`${vaultAddress}-vaults`].callsReturnContext[0].returnValues
                const totalDebt = multicallResults[`${vaultAddress}-vaultInfo`].callsReturnContext[0].returnValues[0]
                const debtRatio = multicallResults[`${vaultAddress}-vaultInfo`].callsReturnContext[1].returnValues[0]
                const managementFee = multicallResults[`${vaultAddress}-vaultInfo`].callsReturnContext[2].returnValues[0]
                const performanceFee = multicallResults[`${vaultAddress}-vaultInfo`].callsReturnContext[3].returnValues[0]
                const vaultAssets = multicallResults[`${vaultAddress}-vaults`].callsReturnContext[1].returnValues
                const strategyAddresses = multicallResults[`${vaultAddress}-strategies`].callsReturnContext[0].returnValues
                console.log('strategyAddresses', strategyAddresses)
                const strategies = multicallResults[`${vaultAddress}-strategies`].callsReturnContext[1].returnValues
                const id = vaultStaticInfo[0]
                const typeId = vaultStaticInfo[1]
                const tokenId = vaultStaticInfo[2]
                const name = vaultStaticInfo[3]
                const version = vaultStaticInfo[4]
                const symbol = vaultStaticInfo[5]
                const decimals = vaultStaticInfo[6]

                const totalAssets = vaultAssets[3][0]
                const totalAssetsUsd = vaultAssets[3][1]
                console.log('totalAssetsUsd', totalAssetsUsd)
                const price = vaultAssets[4][0]
                const depositLimit = vaultAssets[4][3]
                const vault = {
                    address: id,
                    name: name,
                    price,
                    network: {
                        chainId: 1,
                        name: 'mainnet',
                    },
                    version: version,
                    want: tokenId,
                    token: {
                        address: tokenId,
                        name: symbol.split('yv')[1],
                        symbol: symbol.split('yv')[1],
                        decimals: parseInt(decimals),
                        description: '',
                    },
                    endorsed: true,
                    governance: '0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52',
                    totalAssets,
                    availableDepositLimit: undefined,
                    lockedProfitDegradation: undefined,
                    totalDebt,
                    decimals: ethers.BigNumber.from(decimals), // TODO decimals of vault token?
                    debtRatio,
                    managementFee,
                    performanceFee,
                    depositLimit: ethers.BigNumber.from(depositLimit),
                    activation: ethers.constants.Zero, // TODO
                    strategies: [], // TODO
                    withdrawalQueue: [], // TODO
                    apy: {
                        type: 'static',
                        gross: 0,
                        net: 0,
                        [-7]: 0,
                        [-30]: 0,
                        inception: 0,
                    }, // TODO
                    tvls: {
                        dates: [0], // TODO
                        tvls: [ethers.BigNumber.from(totalAssetsUsd).div(1e6).toNumber()], // TODO
                    },
                    rewardsUsd: 0, // TODO
                    warnings: [], // TODO
                }
                for (let i = 0; i < strategies.length; i++) {
                    const strategy = strategies[i]
                    const strategyInfoFromMulticall =
                        strategyInfoMulticallResults[`${vaultAddress}-${strategyAddresses[i]}-strategyInfo`].callsReturnContext[0].returnValues
                    let strategyInfo = {
                        performanceFee: strategyInfoFromMulticall[0],
                        activation: strategyInfoFromMulticall[1],
                        debtRatio: strategyInfoFromMulticall[2],
                        lastReport: strategyInfoFromMulticall[5],
                        totalDebt: strategyInfoFromMulticall[6],
                        totalGain: strategyInfoFromMulticall[7],
                        totalLoss: strategyInfoFromMulticall[8],
                    }
                    console.log('strategyInfo', strategyInfo)
                    const withdrawalQueuePosition =
                        strategyInfoMulticallResults[`${vaultAddress}-${strategyAddresses[i]}-strategyInfo`].callsReturnContext[1].returnValues[0]
                    const name = strategy[0]
                    const keeper = strategy[5]
                    const delegatedAssets = strategy[9]
                    const estimatedTotalAssets = strategy[10]
                    vault.strategies.push({
                        address: strategyAddresses[i],
                        name,
                        description: 'TODO',
                        risk: {
                            riskGroupId: '',
                            riskGroup: '',
                            riskScore: 0,
                            tvl: strategy[10],
                            allocation: {
                                availableAmount: '',
                                availableTVL: '',
                                currentAmount: '',
                                currentTVL: '',
                            },
                            riskDetails: {
                                TVLImpact: 0,
                                auditScore: 0,
                                codeReviewScore: 0,
                                complexityScore: 0,
                                longevityImpact: 0,
                                protocolSafetyScore: 0,
                                teamKnowledgeScore: 0,
                                testingScore: 0,
                                median: 0,
                            },
                        },
                        network: {
                            chainId: 1,
                            name: 'mainnet',
                        },
                        activation: strategyInfo.activation,
                        debtRatio: strategyInfo.debtRatio,
                        performanceFee: strategyInfo.performanceFee,
                        estimatedTotalAssets: ethers.BigNumber.from(estimatedTotalAssets),
                        delegatedAssets: ethers.BigNumber.from(delegatedAssets),
                        lastReport: strategyInfo.lastReport,
                        totalDebt: strategyInfo.totalDebt,
                        totalDebtUSD: strategyInfo.totalDebt, // TODO
                        totalGain: strategyInfo.totalGain,
                        totalLoss: strategyInfo.totalLoss,
                        withdrawalQueuePosition, // TODO
                        lendStatuses: [], // TODO
                        healthCheck: '', // TODO
                        doHealthCheck: true, // TODO
                        tradeFactory: '', // TODO
                        keeper,
                        rewards: [], // TODO
                    })
                }
                vault.withdrawalQueue = vault.strategies

                vaults.push(vault)
            } catch (error) {
                console.log(error)
            }
        }
        resolve(vaults)
        return
    })
}
module.exports = {
    getVaults,
}
