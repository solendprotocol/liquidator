import { findWhere } from 'underscore';
import { parsePriceData } from '@pythnetwork/client';
import {
  AggregatorState,
} from '@switchboard-xyz/switchboard-api';
import SwitchboardProgram from '@switchboard-xyz/sbv2-lite';
import { Connection, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Config, OracleAsset, Reserve } from 'global';

const NULL_ORACLE = 'nu11111111111111111111111111111111111111111';
const SWITCHBOARD_V1_ADDRESS = 'DtmE9D2CSB4L5D6A15mraeEjrGMm6auWVzgaD8hK2tZM';
const SWITCHBOARD_V2_ADDRESS = 'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f';

let switchboardV2: SwitchboardProgram | undefined;

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
    const info = await connection.getAccountInfo(pricePublicKey);
    const owner = info?.owner.toString();
    if (owner === SWITCHBOARD_V1_ADDRESS) {
      const result = AggregatorState.decodeDelimited((info?.data as Buffer)?.slice(1));
      price = result?.lastRoundResult?.result;
    } else if (owner === SWITCHBOARD_V2_ADDRESS) {
      if (!switchboardV2) {
        switchboardV2 = await SwitchboardProgram.loadMainnet(connection);
      }
      const result = switchboardV2.decodeLatestAggregatorValue(info!);
      price = result?.toNumber();
    } else {
      console.error('unrecognized switchboard owner address: ', owner);
    }
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
