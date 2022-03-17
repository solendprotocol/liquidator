# Solend-liquidator-bot

open-source version of a liquidation bot running against Solend

## Overview

The Solend liquidator bot identifies and liquidates overexposed obligations. Solend awards liquidators a 5% bonus on each liquidation. See [Solend params](https://docs.solend.fi/protocol/parameters) for the most up-to-date parameters on each asset. This repo is intended as a starting point for the Solend community to build their liquidator bots.

## Usage

A file system wallet funded with SOL, USDC, ETH, SRM BTC is required to liquidate obligations. Users will need to manually rebalance wallet whenever a token is depleted.

1. Install [docker engine](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

2. Update [file system wallet](https://docs.solana.com/wallet-guide/file-system-wallet) path in docker-compose.yaml.

```
secrets:
  keypair:
    file: <PATH TO KEYPAIR WALLET THAT WILL BE LIQUIDATING UNDERWATER OBLIGATIONS>
```

3. Build and run liquidator for all pools

```
docker-compose up --build
```

To run liquidator in background:
```
docker-compose up --build -d
```


## FAQ
1. How to target a specific market?
The liquidator by default checks the health of all markets (aka isolated pools) e.g main, turbo sol, dog, invictus, etc... If you have the necessary assets in your wallet, the liquidator will attempt to liquidate the unhealhty obligation, otherwise, it simply tells you "insufficient fund" and move on to check the next obligation. If you want to target a specific market, you just need to specify the MARKET param in `docker-compose.yaml` with the market address. You may find all the market address for solend in `https://api.solend.fi/v1/config?deployment=production` 

2. How to change RPC network
By default we use the public solana rpc which is slow and highly rate limited. We strongly suggest using a custom RPC network e.g rpcpool, figment, etc.. so your bot may be more competitive and win some liquidations. Once you have your rpc url, you may specify it in `config.ts`
```
{
  name: 'production',
  endpoint: '<YOUR CUSTOM RPC NETWORK URL>',
},
```

3. How to tweak throttling?
If you have a custom rpc network, you would want to disable the default throttling we have set up by specifying the THROTTLE environment variable in `docker-compose.yaml` to 0
```
  - THROTTLE=0 # Throttle not avoid rate limiting
```

## Support

PRs to improve this repo are welcomed! If you need help setting up your liquidator bot, feel free to post your questions in the #dev-support channel within [Solend's discord server](https://discord.gg/exscEFpB7s).
