import { findWhere } from 'underscore';
import { parsePriceData } from '@pythnetwork/client';
import {
  AggregatorState,
  parseAggregatorAccountData,
} from '@switchboard-xyz/switchboard-api';
import { Connection, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Config, OracleAsset, Reserve } from 'global';

const NULL_ORACLE = 'nu11111111111111111111111111111111111111111';

async function getTokenOracleData(
  connection: Connection,
  config: Config,
  oracles: OracleAsset[],
  reserve: Reserve,
) {
  let price;
  const oracle = findWhere(oracles, { asset: reserve.asset });
  if (oracle.priceAddress && oracle.priceAddress !== NULL_ORACLE) {
    const pricePublicKey = new PublicKey(oracle.priceAddress);
    const result = await connection.getAccountInfo(pricePublicKey);
    price = parsePriceData(result!.data).price;
  } else {
    const pricePublicKey = new PublicKey(oracle.switchboardFeedAddress);
    const state: AggregatorState = await parseAggregatorAccountData(connection, pricePublicKey);
    price = state.currentRoundResult?.result?.valueOf() || state.lastRoundResult?.result?.valueOf() || 0;
  }

  const assetConfig = findWhere(config.assets, { symbol: oracle.asset });

  return {
    symbol: oracle.asset,
    reserveAddress: reserve.address,
    mintAddress: assetConfig.mintAddress,
    decimals: new BigNumber(10 ** assetConfig.decimals),
    price: new BigNumber(price!),
  };
}

export async function getTokensOracleData(connection: Connection, config: Config, reserves) {
  const promises: any = [];
  const oracles = config.oracles.assets;
  reserves.forEach((reserve) => { promises.push(getTokenOracleData(connection, config, oracles, reserve)); });
  const results = await Promise.all(promises);
  return results;
}
