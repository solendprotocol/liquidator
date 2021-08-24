# Solend-liquidator-bot

open-source version of a liquidation bot running against Solend

## Overview

The Solend liquidator bot identifies underwater obligations to liquidate. Solend awards liquidators a 5% bonus on each liquidation. See [Solend params](https://docs.solend.fi/protocol/parameters) for the most up-to-date parameters on each asset. This repo is intended as a starting point for the Solend community to build liquidator bots.

## Usage

1. Install [docker-compose](https://docs.docker.com/compose/install/)
2. Verify you have docker-compose installed by running the following

```
docker-compose --version
```

3. Update [file system wallet](https://docs.solana.com/wallet-guide/file-system-wallet) path in docker-compose.yaml.

```
version: "3.1"

services:
  # The application image
  solend-liquidator:
    restart: unless-stopped
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NETWORK=mainnet # solana network e.g mainnet, devnet
      - THROTTLE=600 # Throttle not avoid rate limiting
    secrets:
      - keypair # secret to encrypte wallet details in container

secrets:
  keypair:
    file: <PATH TO KEYPAIR WALLET THAT WILL BE LIQUIDATING UNDERWATER OBLIGATIONS>
```

4. Build and run service

```
docker-compose up --build
```

## Support

PRs to improve this repo are welcomed! If you need help setting up your liquidator bot, feel free to post your questions in the #dev-support channel within [Solend's discord server](https://discord.gg/exscEFpB7s).
