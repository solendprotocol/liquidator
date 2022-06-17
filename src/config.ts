/* eslint-disable no-loop-func */
import got from 'got';
import { Config, MarketBean } from 'global';

export const OBLIGATION_LEN = 1300;
export const RESERVE_LEN = 619;
export const LENDING_MARKET_LEN = 290;
export const ENDPOINTS = [
  {
    name: 'production',
    endpoint: 'https://solend.rpcpool.com/a3e03ba77d5e870c8c694b19d61c',
  },
  {
    name: 'devnet',
    endpoint: 'https://api.devnet.solana.com',
  },
];
const eligibleApps = ['production', 'devnet'];

function getApp() {
  const app = process.env.APP;
  if (!eligibleApps.includes(app!)) {
    throw new Error(`Unrecognized env app provided: ${app}`);
  }
  return app;
}

export async function deserializeMarkets(data: MarketBean[]): Promise<MarketBean[]> {
  return data;
}

export async function getMarkets(): Promise<MarketBean[]> {
  let attemptCount = 0;
  let backoffFactor = 1;
  const maxAttempt = 10;

  do {
    try {
      if (attemptCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoffFactor * 10));
        backoffFactor *= 2;
      }
      attemptCount += 1;
      const resp = await got(`https://api.solend.fi/v1/markets/configs?deployment=${getApp()}`, { json: true });
      const data = resp.body as MarketBean[];
      return await deserializeMarkets(data);
    } catch (error) {
      console.error('error fetching /v1/markets: ', error);
    }
  } while (attemptCount < maxAttempt);

  throw new Error('failed to fetch /v1/markets');
}

export async function getConfig(): Promise<Config> {
  let attemptCount = 0;
  let backoffFactor = 1;
  const maxAttempt = 10;

  do {
    try {
      if (attemptCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoffFactor * 10));
        backoffFactor *= 2;
      }
      attemptCount += 1;
      const resp = await got(`https://api.solend.fi/v1/config?deployment=${getApp()}`, { json: true });
      return resp.body as Config;
    } catch (error) {
      console.error('error fetching /v1/config: ', error);
    }
  } while (attemptCount < maxAttempt);

  throw new Error('failed to fetch /v1/config');
}

export const network = getApp();
export const clusterUrl = ENDPOINTS.find((env) => env.name === network);
