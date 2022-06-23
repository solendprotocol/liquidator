/* eslint-disable no-loop-func */
import got from 'got';
import { MarketConfig } from 'global';

export const OBLIGATION_LEN = 1300;
export const RESERVE_LEN = 619;
export const LENDING_MARKET_LEN = 290;
export const ENDPOINTS = [
  {
    name: 'production',
    endpoint: 'https://solana-api.projectserum.com',
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

export async function getMarkets(): Promise<MarketConfig[]> {
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
      const data = resp.body as MarketConfig[];
      return data;
    } catch (error) {
      console.error('error fetching /v1/markets: ', error);
    }
  } while (attemptCount < maxAttempt);

  throw new Error('failed to fetch /v1/markets');
}

export const network = getApp();
export const clusterUrl = ENDPOINTS.find((env) => env.name === network);
