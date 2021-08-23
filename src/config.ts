import {
  Config, devnetConfig, productionConfig,
} from '@solendprotocol/common/dist';

export const OBLIGATION_LEN = 1300;
export const RESERVE_LEN = 619;
export const LENDING_MARKET_LEN = 290;
export const ENDPOINTS = [
  {
    name: 'mainnet',
    endpoint: 'https://api.mainnet-beta.solana.com',
  },
  {
    name: 'devnet',
    endpoint: 'https://api.devnet.solana.com',
  },
];
const eligibleNetworks = ['mainnet', 'devnet'];

function getNetwork() {
  const network = process.env.NETWORK;
  if (!eligibleNetworks.includes(network!)) {
    throw new Error(`Unrecognized env network provided: ${network}`);
  }
  return network;
}

function getConfig(): Config {
  switch (network) {
    case 'mainnet':
      return productionConfig;
    case 'devnet':
      return devnetConfig;
    default:
      console.log(`Invalid network ${network}`);
      throw new Error(`Invalid network ${network}`);
  }
}

export const network = getNetwork();
export const clusterUrl = ENDPOINTS.find((env) => env.name === network);
export const config = getConfig();
