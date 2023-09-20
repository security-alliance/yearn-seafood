// const Pool = require('pg').Pool;

// if(!process.env.DB_HOST) console.error('!DB_HOST')
// if(!process.env.DB_USER) console.error('!DB_USER')
// if(!process.env.DB_PASS) console.error('!DB_PASS')

// const pool = new Pool({
// 	user: process.env.DB_USER,
// 	host: process.env.DB_HOST,
// 	database: 'reports',
// 	password: process.env.DB_PASS,
// 	port: 5432,
// });

// const format = require('pg-format');

const ethers = require('ethers')
const strategyABI = ['event Harvested(uint256 profit, uint256 loss, uint256 debtPayment, uint256 debtOutstanding)']

const usdcStrategy = '0x97D868b5C2937355Bf89C5E5463d52016240fE86'
const usdcVault = '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE'

const getReports = (options) => {
    return new Promise(function (resolve, reject) {
        if (!options.strategies?.length) {
            resolve([])
            return
        }

        if (options.chainId !== '1') {
            resolve([])
            return
        }

        // Only usdc for now
        if (!options.strategies.includes(usdcStrategy)) {
            resolve([])
            return
        }

        const provider = new ethers.providers.JsonRpcProvider(process.env[`RPC_URI_FOR_${chainId}`])
        const startBlock = process.env[`START_BLOCK`]

        const strategyContract = new ethers.Contract(usdcStrategy, strategyABI, provider)

        const filter = strategyContract.filters.Harvested(null, null, null, null)
        provider
            .getLogs({
                fromBlock: startBlock,
                toBlock: 'latest',
                address: tradeFactoryContract.address,
                topics: filter.topics,
            })
            .then((logs) => {
                console.log(logs)
                const reports = []
                logs.forEach((log) => {
                    const event = tradeFactoryContract.interface.parseLog(log)
                    const rawGain = log.args.profit.toString()
                    const rawLoss = log.args.loss.toString()
                    const rawDebtPayment = log.args.debtPayment.toString()
                    const rawDebtOutstanding = log.args.debtOutstanding.toString()
                    const gain = ethers.utils.formatUnits(rawGain, 6)
                    const loss = ethers.utils.formatUnits(rawLoss, 6)
                    const debt_paid = ethers.utils.formatUnits(rawDebtPayment, 6)
                    const debt_added = 'TODO debt added'
                    const want_gain_usd = 'TODO want gain usd'
                    const rough_apr_pre_fee = 'TODO rough apr pre fee'

                    const report = {
                        chain_id: options.chainId,
                        block: log.blockNumber.toString(),
                        timestamp: 'TODO timestamp',
                        date_string: 'TODO date',
                        txn_hash: log.transactionHash,
                        vault_address: usdcVault,
                        strategy_address: log.address,
                        gain,
                        loss,
                        debt_paid,
                        debt_added,
                        want_gain_usd,
                        rough_apr_pre_fee,
                    }
                    reports.push(report)
                })
                resolve(reports)
                return
            })
            .catch((error) => {
                console.log(error)
                resolve([])
                return
            })

        // const query = format(
        // 	'SELECT * FROM reports WHERE chain_id = %L AND strategy_address IN (%L) ORDER BY block DESC',
        // 	options.chainId, options.strategies
        // );

        // pool.query(query, (error, results) => {
        // 	if (error) {
        // 		reject(error);
        // 	} else {
        // 		resolve(results.rows);
        // 	}
        // });
    })
}
module.exports = {
    getReports,
}

const reqOptions = {
    chainId: 1,
    strategies: [
        '0x9AA08BA012B2f2c002BbC56a8c3ECE5b3E8299d3',
        '0xC7af91cdDDfC7c782671eFb640A4E4C4FB6352B4',
        '0xD94f90E8df35c649573b6d2F909EDd8C8a791422',
        '0xd2CF8B07fc913e6219E5031B147827c4D0e58A08',
        '0xd4E94061183b2DBF24473F28A3559cf4dE4459Db',
        '0x1c48c959562bEb01eDcc08F0a037Eb97f299ea66',
        '0x6e1B0f553D038f0f2de0366A268F1180d5657b7d',
        '0x66f7b6E7EB858075d6F2c5615F22659a1A20f6D6',
        '0xf2BFe60f20685C45257B7f00b7e4068918CFF740',
        '0x5F84acB4a27D762FC0E5CD6EFc1674827c0934C4',
        '0x0c8f62939Aeee6376f5FAc88f48a5A3F2Cf5dEbB',
        '0x97D868b5C2937355Bf89C5E5463d52016240fE86',
        '0x336600990ae039b4acEcE630667871AeDEa46E5E',
        '0x9D42427830e617C7cf55050092E899569CeE0233',
        '0xB1bC173c2BCC98E8EEDE8Af0443AcE29b8fA2992',
        '0x7C2b9DB2Ae5aCC6fAC2Fd6cE9b01A5EB4bDD1309',
        '0xcFa730D6CD6568872C18101442228499229fb70E',
        '0xBd5743e90188a6e72d57a9b85756f56b7c333876',
        '0xd4485545e8D00fAa454ff95b4a016D1045eDf907',
        '0xBEDDD783bE73805FEbda2C40a2BF3881F04Fd7Cc',
        '0x342491C093A640c7c2347c4FFA7D8b9cBC84D1EB',
        '0x0Fd45d4fb70D1EC95264dA30934095443DC6af6A',
        '0x358eb2Ecfa2057Ac52dD435427cB8D094B33AbE0',
        '0x7C85c0a8E2a45EefF98A10b6037f70daf714B7cf',
        '0x960818b3F08dADca90b840298721FE7B419fBE12',
        '0x2216E44fA633ABd2540dB72Ad34b42C7F1557cd4',
        '0xD799d307096B1d1cf204Ea7296046D19235b1Bc2',
        '0xE5b16812686Fc4ae7C5Db0dc752172B2CD479F52',
        '0xA558D4Aef61AACDEE8EF21c11B3164cd11B273Af',
        '0x7A32aA9a16A59CB335ffdEe3dC94024b7F8A9a47',
    ],
}
