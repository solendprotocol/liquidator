import { ORCA_TOKEN_SWAP_ID, OrcaPoolConfig, getOrca } from "@orca-so/sdk";
import {
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil,
  PoolUtil,
} from "@orca-so/whirlpools-sdk";
import { web3 } from "@project-serum/anchor";
import { Fetcher } from "./fetcher";
import { Pools } from "./pools";

enum SwapWhirlpools {
  HDG_USDC = "HZUXGiKoFMqEaBRvJZJs4ueFRdK8zrVMb9akHSatNt64",
}

type SwapAccounts = {
  programId: web3.PublicKey;
  destinationTokenMint: web3.PublicKey;
  metas: web3.AccountMeta[];
};

export async function swapRewardsAccounts(
  whirlpool: web3.PublicKey,
  mintKeys: web3.PublicKey[],
  fetcher: Fetcher
): Promise<SwapAccounts[]> {
  switch (whirlpool.toString()) {
    case Pools.USDH_USDC:
      return [
        getOrcaSwapAccounts(mintKeys[0], OrcaPoolConfig.HBB_USDC),
        getOrcaSwapAccounts(mintKeys[1], OrcaPoolConfig.ORCA_USDC),
      ];

    case Pools.USH_USDC:
      return [
        await getWhirlpoolSwapAccounts(
          mintKeys[0],
          SwapWhirlpools.HDG_USDC,
          fetcher
        ),
        getOrcaSwapAccounts(mintKeys[1], OrcaPoolConfig.ORCA_USDC),
      ];

    default:
      throw new Error("unset swap pools for " + whirlpool);
  }
}

function getOrcaSwapAccounts(
  rewardsMintKey: web3.PublicKey,
  config: OrcaPoolConfig
): SwapAccounts {
  const orca = getOrca(null as unknown as web3.Connection) as any;
  const pool = orca.getPool(config)["poolParams"];

  const inputTokenIndx = (pool.tokenIds as [any]).findIndex(
    (token) => token === rewardsMintKey.toString()
  );

  const destinationTokenIndx = (inputTokenIndx + 1) % 2;
  const destinationTokenMint = new web3.PublicKey(
    pool.tokenIds[destinationTokenIndx]
  );

  return {
    programId: ORCA_TOKEN_SWAP_ID,
    destinationTokenMint,
    metas: [
      {
        isSigner: false,
        isWritable: false,
        pubkey: pool.address,
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: pool.authority,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pool.tokens[pool.tokenIds[inputTokenIndx]].addr,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pool.tokens[pool.tokenIds[destinationTokenIndx]].addr,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pool.poolTokenMint,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pool.feeAccount,
      },
    ],
  };
}

async function getWhirlpoolSwapAccounts(
  rewardsMintKey: web3.PublicKey,
  whirlpoolStr: string,
  fetcher: Fetcher
): Promise<SwapAccounts> {
  const whirlpool = new web3.PublicKey(whirlpoolStr);
  const pool = await fetcher.getWhirlpoolData(whirlpool);

  let isAtoB: boolean;
  let destinationTokenMint;

  if (pool.tokenMintA.toString() === rewardsMintKey.toString()) {
    destinationTokenMint = pool.tokenMintB;
    isAtoB = true;
  } else {
    destinationTokenMint = pool.tokenMintA;
    isAtoB = false;
  }

  const tickArrayAddresses = (PoolUtil as any).getTickArrayPublicKeysForSwap(
    pool.tickCurrentIndex,
    pool.tickSpacing,
    isAtoB,
    ORCA_WHIRLPOOL_PROGRAM_ID,
    whirlpool
  );

  const oracleKeypair = PDAUtil.getOracle(ORCA_WHIRLPOOL_PROGRAM_ID, whirlpool);

  return {
    programId: ORCA_WHIRLPOOL_PROGRAM_ID,
    destinationTokenMint,
    metas: [
      {
        isSigner: false,
        isWritable: true,
        pubkey: whirlpool,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pool.tokenVaultA,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: pool.tokenVaultB,
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: tickArrayAddresses[0],
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: tickArrayAddresses[1],
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: tickArrayAddresses[2],
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: oracleKeypair.publicKey,
      },
    ],
  };
}
