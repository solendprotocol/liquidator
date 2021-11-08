import { findWhere } from 'underscore';
import { parsePriceData } from '@pythnetwork/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { OracleAsset, Reserve } from '@solendprotocol/common';
import BigNumber from 'bignumber.js';
import { config } from 'config';

async function getTokenOracleData(
  connection: Connection,
  oracles: OracleAsset[],
  reserve: Reserve,
) {
  const oracle = findWhere(oracles, { asset: reserve.asset });
  const pricePublicKey = new PublicKey(oracle.priceAddress);
  const result = await connection.getAccountInfo(pricePublicKey);
  const { price } = parsePriceData(result!.data);
  const assetConfig = findWhere(config.assets, { symbol: oracle.asset });

  return {
    symbol: oracle.asset,
    reserveAddress: reserve.address,
    mintAddress: assetConfig.mintAddress,
    decimals: new BigNumber(10 ** assetConfig.decimals),
    price: new BigNumber(price!),
  };
}

export async function getTokensOracleData(connection: Connection, reserves) {
  const promises: any = [];
  const oracles = config.oracles.assets;
  reserves.forEach((reserve) => promises.push(getTokenOracleData(connection, oracles, reserve)));
  const results = await Promise.all(promises);
  return results;
}
