/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import {
  Account,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import dotenv from 'dotenv';
import { ObligationParser } from 'models/layouts/obligation';
import {
  getObligations, getReserves, getWalletTokenData, wait,
} from 'libs/utils';
import { getTokensOracleData } from 'libs/pyth';
import { calculateRefreshedObligation } from 'libs/refreshObligation';
import { readSecret } from 'libs/secret';
import { liquidateAndRedeem } from 'libs/actions/liquidateAndRedeem';
import { clusterUrl, getConfig, getMarkets } from './config';

dotenv.config();

async function runLiquidator() {
  const markets = await getMarkets();
  const config = await getConfig();
  const connection = new Connection(clusterUrl!.endpoint, 'confirmed');

  // liquidator's keypair.
  const payer = new Account(JSON.parse(readSecret('keypair')));

  console.log(`
    app: ${process.env.APP}
    clusterUrl: ${clusterUrl!.endpoint}
    wallet: ${payer.publicKey.toBase58()}
  `);

  for (let epoch = 0; ; epoch += 1) {
    for (const market of markets) {
      // Target specific market if MARKET is specified in docker-compose.yaml
      if (process.env.MARKET && process.env.MARKET !== market.address) {
        continue;
      }

      const tokensOracle = await getTokensOracleData(connection, market);
      const allObligations = await getObligations(connection, market.address);
      const allReserves = await getReserves(connection, market.address);

      for (let obligation of allObligations) {
        try {
          while (obligation) {
            const {
              borrowedValue,
              unhealthyBorrowValue,
              deposits,
              borrows,
            } = calculateRefreshedObligation(
              obligation.info,
              allReserves,
              tokensOracle,
            );

            // Do nothing if obligation is healthy
            if (borrowedValue.isLessThanOrEqualTo(unhealthyBorrowValue)) {
              break;
            }

            // select repay token that has the highest market value
            let selectedBorrow;
            borrows.forEach((borrow) => {
              if (!selectedBorrow || borrow.marketValue.gt(selectedBorrow.marketValue)) {
                selectedBorrow = borrow;
              }
            });

            // select the withdrawal collateral token with the highest market value
            let selectedDeposit;
            deposits.forEach((deposit) => {
              if (!selectedDeposit || deposit.marketValue.gt(selectedDeposit.marketValue)) {
                selectedDeposit = deposit;
              }
            });

            if (!selectedBorrow || !selectedDeposit) {
              // skip toxic obligations caused by toxic oracle data
              break;
            }

            console.log(`Obligation ${obligation.pubkey.toString()} is underwater
              borrowedValue: ${borrowedValue.toString()}
              unhealthyBorrowValue: ${unhealthyBorrowValue.toString()}
              market address: ${market.address}`);

            // get wallet balance for selected borrow token
            const { balanceBase } = await getWalletTokenData(connection, config, payer, selectedBorrow.mintAddress, selectedBorrow.symbol);
            if (balanceBase === 0) {
              console.log(`insufficient ${selectedBorrow.symbol} to liquidate obligation ${obligation.pubkey.toString()} in market: ${market.address}`);
              break;
            } else if (balanceBase < 0) {
              console.log(`failed to get wallet balance for ${selectedBorrow.symbol} to liquidate obligation ${obligation.pubkey.toString()} in market: ${market.address}. 
                Potentially network error or token account does not exist in wallet`);
              break;
            }

            // Set super high liquidation amount which acts as u64::MAX as program will only liquidate max
            // 50% val of all borrowed assets.
            await liquidateAndRedeem(
              connection,
              payer,
              balanceBase,
              selectedBorrow.symbol,
              selectedDeposit.symbol,
              market,
              obligation,
            );

            const postLiquidationObligation = await connection.getAccountInfo(
              new PublicKey(obligation.pubkey),
            );
            obligation = ObligationParser(obligation.pubkey, postLiquidationObligation!);
          }
        } catch (err) {
          console.error(`error liquidating ${obligation!.pubkey.toString()}: `, err);
          continue;
        }
      }

      // Throttle to avoid rate limiter
      if (process.env.THROTTLE) {
        await wait(Number(process.env.THROTTLE));
      }
    }
  }
}

runLiquidator();
