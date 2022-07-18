# Solend-liquidator-bot

Table of contents
  * [Overview](#overview)
  * [Basic Usage](#basic-usage)
  * [FAQ](#faq)
    + [Enabling wallet rebalancing](#enabling-wallet-rebalancing)
    + [Rebalance padding](#rebalance-padding)
    + [Target specific markets](#target-specific-markets)
    + [Tweak throttling](#tweak-throttling)
  * [Support](#support)

## Overview

The Solend liquidator bot identifies and liquidates overexposed obligations. Solend awards liquidators a 5-20% bonus on each liquidation. Visit [Solend documentation](https://docs.solend.fi/protocol/parameters) for the parameters on each asset. This repo is intended as a starting point for the Solend community to build their liquidator bots.

## Basic Usage

A funded file system wallet is required to liquidate obligations. Users may choose to [enable auto rebalancing](#enabling-wallet-rebalancing) or manually rebalance after tokens have been used to repay a debt.

1. A private RPC is required as public RPCs have strict rate limiting and response size restrictions. You can get a private rpc set up in minutes through [Figment](https://www.figment.io/datahub/solana) which provides a free tier of 3m request/month and the PRO tier costs only $50/month. Set your private RPC in `docker-compose.yaml`
```
- RPC_ENDPOINT=<YOUR PRIVATE RPC ENDPOINT>
```

2. Install [docker engine](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

3. Update [file system wallet](https://docs.solana.com/wallet-guide/file-system-wallet) path in docker-compose.yaml.

```
secrets:
  keypair:
    file: <PATH TO KEYPAIR WALLET THAT WILL BE LIQUIDATING UNDERWATER OBLIGATIONS>
```

4. Build and run liquidator

```
docker-compose up --build
```

P.S. To run liquidator in background:
```
docker-compose up --build -d
```

## FAQ
### Enabling wallet rebalancing
The auto rebalancing has to be explicitly enabled by specifying the token distribution in `docker-compose.yaml`. Under the hood, the liquidator uses [Jupiter](https://docs.jup.ag/) to rebalance against the USDC<>token pair. Make sure your wallet has an excess amount of USDC to cover liquidation of USDC positions along with rebalancing of other assets. A rule of thumb of USDC to hold is (targeted USDC amount * 1.3). Note that since USDC is base token, we will only use USDC to purchase other tokens when required but not use other tokens to purchase USDC when USDC holdings is below target value. The rebalancer neglets the USDC target value and its only listed to ensure users deposit USDC. Nonetheless, do not remove USDC from the target distribution.

Steps:

1. In `docker-compose.yaml`, uncomment the following line
```
# - TARGETS=USDC:100 USDT:5 scnSOL:0.5 SOL:0.5
```

2. Specify the distribution you would like. The following format is required:
```
<TokenA>:<amount> <TokenB>:<amount> ... <TokenZ>:<amount>
```
The amount is in token units e.g `SOL:1` means 1 SOL and `ETH:2` mean 2 ETH. The distribution is set using token units instead of token price to keep rebalancer  independent of price fluctuations but only after a liquidation transaction has been executed.

Example: Distribution where we expect the liquidator wallet to be holding 500 USDT, 10 SOL and 1 ETH. As mentioned above, the USDC target is ignored as it is the base token we trade to/from.
```
# - TARGETS=USDC:1000 USDT:500 SOL:10 ETH:1
```

### Rebalance padding
The env variable `REBALANCE_PADDING` is introduced in `docker-compose.yaml` to avoid unnecessary padding. If the targeted SOL amount is 10 and `REBALANCE_PADDING` is 0.2, we will only swap USDC for SOL when SOL holding is under 8 SOL = (10 SOL * (1 - REBALANCE_PADDING )) and only sell when SOL holding is over 12 SOL = (10 SOL * (1 + REBALANCE_PADDING)). Default padding is set to 0.2

### Target specific markets
BY default the liquidator runs against all solend created pools e.g main, TURBO SOL, dog, etc... If you want to target specific markets, you just need to specify the MARKETS param in `docker-compose.yaml` separated by commas. The following definition will configures the liquidator to only run against the main and coin98 pools.

```
MARKET=4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY,7tiNvRHSjYDfc6usrWnSNPyuN68xQfKs1ZG2oqtR5F46
```

### Tweak throttling
If you are getting rate limited by your RPC provider, you can use the following env variable to avoid getting rate limited. If you have a custom RPC provider, you will be fine without any throttling.
```
  - THROTTLE=1000 # Throttle not avoid rate limiting. In milliseconds
```

## Support

PRs to improve this repo are welcomed! If you need help setting up your liquidator bot, feel free to post your questions in the #dev-support channel within [Solend's discord server](https://discord.gg/exscEFpB7s).
