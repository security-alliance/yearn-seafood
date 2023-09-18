const ethers = require('ethers')
const vaultRegistryAbi = [
    'function assetDynamic(address) view returns (tuple(address id, string typeId, address tokenId, uint256 amount, uint256 amountUsdc, uint256 pricePerShare, bool migrationAvailable, address latestVaultAddress, uint256 depositLimit, bool emergencyShutdown))',
    'function assetStatic(address) view returns (tuple(address id, string typeId, address tokenId, string name, string version, string symbol, uint8 decimals))',
]

const strategiesHelperAbi = [
    'function assetStrategiesAddresses(address) view returns (address[])',
    'function assetStrategies(address) view returns (tuple(string name, string apiVersion, address strategist, address rewards, address vault, address keeper, address want, bool emergencyExit, bool isActive, uint256 delegatedAssets, uint256 estimatedTotalAssets)[])',
]

const vaultRegistryAddress = '0x240315db938d44bb124ae619f5Fd0269A02d1271'
const strategyRegistryAddress = '0xae813841436fe29b95a14AC701AFb1502C4CB789'

const vaultAddresses = ['0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE']

const getVaults = async () => {
    return new Promise(async function (resolve, reject) {
        const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URI_FOR_1`])

        const strategiesRegistry = new ethers.Contract(strategyRegistryAddress, strategiesHelperAbi, provider)
        const vaultsRegistry = new ethers.Contract(vaultRegistryAddress, vaultRegistryAbi, provider)

        const vaults = []

        for (const vaultAddress of vaultAddresses) {
            console.log('vaultAddress', vaultAddress)
            try {
                const vaultInfo = await vaultsRegistry.assetStatic(vaultAddress)
                const vaultAssets = await vaultsRegistry.assetDynamic(vaultAddress)
                const strategyAddresses = await strategiesRegistry.assetStrategiesAddresses(vaultAddress)
                const strategies = await strategiesRegistry.assetStrategies(vaultAddress)
                const id = vaultInfo[0]
                const typeId = vaultInfo[1]
                const tokenId = vaultInfo[2]
                const name = vaultInfo[3]
                const version = vaultInfo[4]
                const symbol = vaultInfo[5]
                const decimals = vaultInfo[6]

                const totalAssets = vaultAssets[3]
                const price = vaultAssets[5]
                const depositLimit = vaultAssets[8]
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
                    totalDebt: undefined,
                    decimals: ethers.BigNumber.from(decimals), // TODO decimals of vault token?
                    debtRatio: undefined,
                    managementFee: ethers.BigNumber.from(0), // TODO
                    performanceFee: ethers.constants.Zero, // TODO
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
                        tvls: [0], // TODO
                    },
                    rewardsUsd: 0, // TODO
                    warnings: [], // TODO
                }
                strategies.forEach((strategy, i) => {
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
                            tvl: 0,
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
                        activation: ethers.constants.Zero, // TODO
                        debtRatio: undefined,
                        performanceFee: ethers.constants.Zero, // TODO
                        estimatedTotalAssets: ethers.BigNumber.from(estimatedTotalAssets),
                        delegatedAssets: ethers.BigNumber.from(delegatedAssets),
                        lastReport: ethers.constants.Zero, // TODO
                        totalDebt: ethers.constants.Zero, // TODO
                        totalDebtUSD: 0, // TODO
                        totalGain: ethers.constants.Zero, // TODO
                        totalLoss: ethers.constants.Zero, // TODO
                        withdrawalQueuePosition: 0, // TODO
                        lendStatuses: [], // TODO
                        healthCheck: '', // TODO
                        doHealthCheck: false, // TODO
                        tradeFactory: '', // TODO
                        keeper,
                        rewards: [], // TODO
                    })
                })
                vault.withdrawalQueue = vault.strategies
                vaults.push(vault)
            } catch (error) {
                console.log(error)
            } finally {
                console.log('resolving', vaults)
                resolve(vaults)
                return
            }
        }
    })
}
module.exports = {
    getVaults,
}
