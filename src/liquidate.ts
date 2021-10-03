/* eslint-disable no-continue */
/* eslint-disable no-constant-condition */
/* eslint-disable no-restricted-syntax */
import {
  Account,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import _ from 'underscore';
import dotenv from 'dotenv';
import { liquidateObligation } from 'libs/actions/liquidateObligation';
import { ObligationParser } from 'models/layouts/obligation';
import {
  getCollateralBalances,
  getObligations, getReserves, getWalletTokenData, wait,
} from 'libs/utils';
import { getTokensOracleData } from 'libs/pyth';
import { calculateRefreshedObligation } from 'libs/refreshObligation';
import { redeemCollateral } from 'libs/actions/redeemCollateral';
import { readSecret } from 'libs/secret';
import { clusterUrl, config } from './config';

dotenv.config();

async function runLiquidator() {
  const lendingMarkets = _.findWhere(config.markets, { name: 'main' });
  const { reserves } = lendingMarkets;
  const connection = new Connection(clusterUrl!.endpoint, 'confirmed');
  const lendingMarketPubKey = new PublicKey(lendingMarkets.address);

  // liquidator's keypair.
  const payer = new Account(JSON.parse(readSecret('keypair')));

  console.log(`
    network: ${process.env.NETWORK}
    clusterUrl: ${clusterUrl!.endpoint}
    wallet: ${payer.publicKey.toBase58()}
  `);

  for (let epoch = 0; ; epoch += 1) {
    const tokensOracle = await getTokensOracleData(connection, reserves)
      .catch((e) => console.error('failed to fetch oracle: ', e));
    const allObligations = await getObligations(connection, lendingMarketPubKey)
      .catch((e) => console.error('failed to fetch obligations: ', e));
    const allReserves = await getReserves(connection, lendingMarketPubKey)
      .catch((e) => console.error('failed to fetch reserves: ', e));

    if (!tokensOracle || !allObligations || !allReserves) {
      console.log('Failed to fetch required data. Reattempting...');
      continue;
    }

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
            obligation.pubkey,
            allReserves,
            tokensOracle,
          );

          // Do nothing if obligation is healthy
          if (borrowedValue.isLessThanOrEqualTo(unhealthyBorrowValue)) {
            break;
          }

          console.log(
            `Obligation ${obligation.pubkey.toString()} is underwater`,
            'borrowedValue: ', borrowedValue.toString(),
            'unhealthyBorrowValue', unhealthyBorrowValue.toString(),
          );

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
            console.error(
              `Toxic obligation found in ${obligation.pubkey.toString()}, unable to identify repay and withdrawal tokens`,
              selectedBorrow && selectedBorrow.symbol,
              selectedDeposit && selectedDeposit.symbol,
            );
            break;
          }

          // get wallet balance for selected borrow token
          const { balanceBase } = await getWalletTokenData(connection, payer, selectedBorrow.mintAddress, selectedBorrow.symbol);
          if (balanceBase === 0) {
            console.log(`insufficient ${selectedBorrow.symbol} to liquidate obligation ${obligation.pubkey.toString()}`);
            break;
          } else if (balanceBase < 0) {
            console.log(`failed to get wallet balance for ${selectedBorrow.symbol}. Potentially network error or token account does not exist in wallet`);
            break;
          }

          // Set super high liquidation amount which acts as u64::MAX as program will only liquidate max
          // 50% val of all borrowed assets.
          await liquidateObligation(
            connection,
            payer,
            balanceBase,
            selectedBorrow.symbol,
            selectedDeposit.symbol,
            lendingMarkets,
            obligation,
          );

          const postLiquidationObligation = await connection.getAccountInfo(
            new PublicKey(obligation.pubkey),
          );
          obligation = ObligationParser(obligation.pubkey, postLiquidationObligation!);
        }
      } catch (err) {
        console.error(`error liquidating ${obligation.pubkey.toString()}: `, err);
        continue;
      }
    }

    // check if collateral redeeming is required
    const collateralBalances = await getCollateralBalances(connection, payer, reserves);
    collateralBalances.forEach(({ balance, symbol }) => {
      if (balance > 0) {
        redeemCollateral(connection, payer, balance.toString(), symbol, lendingMarkets);
      }
    });

    // Throttle to avoid rate limiter
    if (process.env.THROTTLE) {
      await wait(process.env.THROTTLE);
    }
  }
}

runLiquidator();
