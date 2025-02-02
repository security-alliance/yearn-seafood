const ethers = require('ethers')
const { Multicall } = require('ethereum-multicall')
const express = require('express')
const config = require('../../src/config.json')

const tradeFactoryAbi = ['event TradeEnabled(address indexed seller, address indexed tokenIn, address indexed tokenOut)']

const erc20Abi = [
    { stateMutability: 'view', name: 'name', type: 'function', inputs: [], outputs: [{ name: 'name', type: 'string' }] },
    { stateMutability: 'view', name: 'symbol', type: 'function', inputs: [], outputs: [{ name: 'symbol', type: 'string' }] },
    { stateMutability: 'view', name: 'decimals', type: 'function', inputs: [], outputs: [{ name: 'decimal', type: 'uint8' }] },
]

async function fetchErc20s(provider, erc20Addresses) {
    const multicallAddress = config.chains.find((c) => c.id === provider.network.chainId)?.multicall
    const multicall = new Multicall({ ethersProvider: provider, multicallCustomContractAddress: multicallAddress })

    const calls = erc20Addresses.map((address) => ({
        reference: address,
        contractAddress: address,
        abi: erc20Abi,
        calls: [
            { reference: 'name', methodName: 'name', methodParameters: [] },
            { reference: 'symbol', methodName: 'symbol', methodParameters: [] },
            { reference: 'decimals', methodName: 'decimals', methodParameters: [] },
        ],
    }))

    const results = (await multicall.call(calls)).results
    return Object.keys(results).map((address) => {
        const context = results[address].callsReturnContext
        return {
            address,
            name: context[0].returnValues[0],
            symbol: context[1].returnValues[0],
            decimals: context[2].returnValues[0],
        }
    })
}

const router = express.Router()

router.get('/', async function (req, res) {
    const { chainId, tradeFactory } = req.query
    console.log({ chainId, tradeFactory })
    if (!chainId) res.status(400).send('!chainId')
    if (!tradeFactory) res.status(400).send('!tradeFactory')

    if (chainId === '1') {
        console.log('ChainId is 1', chainId)

        console.log(process.env[`RPC_URI_FOR_${chainId}`])
        const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URI_FOR_${chainId}`])
        const startBlock = process.env[`START_BLOCK`]
        console.log({ startBlock })
        console.log({ provider })
        const fromBlock = startBlock ? parseInt(startBlock) : 'latest'
        try {
            const tradeFactoryContract = new ethers.Contract(tradeFactory, tradeFactoryAbi, provider)

            const filter = tradeFactoryContract.filters.TradeEnabled(null, null, null)
            const logs = await provider.getLogs({
                fromBlock,
                toBlock: 'latest',
                address: tradeFactoryContract.address,
                topics: filter.topics,
            })

            const tradeables = []
            logs.forEach((log) => {
                const event = tradeFactoryContract.interface.parseLog(log)
                const tradeable = { strategy: event.args.seller, token: event.args.tokenIn }
                if (!tradeables.find((t) => t.strategy === tradeable.strategy && t.token === tradeable.token)) {
                    tradeables.push(tradeable)
                }
            })

            const tokens = Array.from(new Set(tradeables.map((t) => t.token)))
            const erc20s = await fetchErc20s(provider, tokens)
            tradeables.forEach((tradeable) => {
                const erc20 = erc20s.find((e) => e.address === tradeable.token)
                tradeable.name = erc20.name
                tradeable.symbol = erc20.symbol
                tradeable.decimals = erc20.decimals
            })

            res.status(200).send(tradeables)
        } catch (error) {
            console.log('error', error)
            res.status(500).send('An error occurred fetching tradeables')
        }
    } else {
      console.log('ChainId is not 1', chainId)
        res.status(400).send('Only mainnet is supported')
    }
})

module.exports = router
