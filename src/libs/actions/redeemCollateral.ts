import {
  Transaction,
  PublicKey,
  Connection,
  Account,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from '@solana/spl-token';
import _ from 'underscore';
import BN from 'bn.js';
import { redeemReserveCollateralInstruction, refreshReserveInstruction } from 'models/instructions';
import { getTokenInfo } from 'libs/utils';
import { Config } from 'global';

export async function redeemCollateral(
  connection: Connection,
  config: Config,
  payer: Account,
  amountBase: string,
  symbol: string,
  lendingMarket,
) {
  const reserve = _.findWhere(lendingMarket!.reserves, { asset: symbol });
  if (!reserve) {
    console.error(`Withdraw: Could not find asset ${symbol} in reserves`);
  }
  const tokenInfo = getTokenInfo(config, symbol);
  const oracleInfo = _.findWhere(config.oracles.assets, { asset: symbol });
  if (!oracleInfo) {
    console.error(`Withdraw: Could not find oracle for ${symbol}`);
  }

  const ixs = [] as any;

  // refreshed reserve is required
  const refreshReserveIx = refreshReserveInstruction(
    config,
    new PublicKey(reserve.address),
    new PublicKey(oracleInfo!.priceAddress),
    new PublicKey(oracleInfo!.switchboardFeedAddress),
  );
  ixs.push(refreshReserveIx);

  // Get collateral account address
  const userCollateralAccountAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(reserve.collateralMintAddress),
    payer.publicKey,
  );

  // Get or create user token account
  const userTokenAccountAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(tokenInfo!.mintAddress),
    payer.publicKey,
  );
  const userTokenAccountInfo = await connection.getAccountInfo(
    userTokenAccountAddress,
  );

  if (!userTokenAccountInfo) {
    const createUserTokenAccountIx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(tokenInfo!.mintAddress),
      userTokenAccountAddress,
      payer.publicKey,
      payer.publicKey,
    );
    ixs.push(createUserTokenAccountIx);
  }
  const withdrawObligationCollateralAndRedeemReserveLiquidityIx = redeemReserveCollateralInstruction(
    config,
    new BN(amountBase),
    userCollateralAccountAddress, // source collateral account
    userTokenAccountAddress, // destinationLiquidity
    new PublicKey(reserve.address),
    new PublicKey(reserve.collateralMintAddress),
    new PublicKey(reserve.liquidityAddress),
    new PublicKey(lendingMarket.address),
    new PublicKey(lendingMarket.authorityAddress),
    payer.publicKey, // transferAuthority
  );
  ixs.push(withdrawObligationCollateralAndRedeemReserveLiquidityIx);

  const tx = new Transaction().add(...ixs);
  const { blockhash } = await connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  try {
    const txHash = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(txHash);
    console.log(`successfully redeemed ${symbol} collaterals`);
  } catch (err) {
    console.error('error redeeming collateral: ', err);
  }
}
