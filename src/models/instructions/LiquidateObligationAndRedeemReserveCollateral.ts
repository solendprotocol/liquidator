import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey, TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import { Config } from 'global';
import * as Layout from 'libs/layout';
import { LendingInstruction } from './instruction';

/// Repay borrowed liquidity to a reserve to receive collateral at a discount from an unhealthy
/// obligation. Requires a refreshed obligation and reserves.
/// Accounts expected by this instruction:
///   0. `[writable]` Source liquidity token account.
///                     Minted by repay reserve liquidity mint.
///                     $authority can transfer $liquidity_amount.
///   1. `[writable]` Destination collateral token account.
///                     Minted by withdraw reserve collateral mint.
///   2. `[writable]` Destination liquidity token account.
///   3. `[writable]` Repay reserve account - refreshed.
///   4. `[writable]` Repay reserve liquidity supply SPL Token account.
///   5. `[writable]` Withdraw reserve account - refreshed.
///   6. `[writable]` Withdraw reserve collateral SPL Token mint.
///   7. `[writable]` Withdraw reserve collateral supply SPL Token account.
///   8. `[writable]` Withdraw reserve liquidity supply SPL Token account.
///   9. `[writable]` Withdraw reserve liquidity fee receiver account.
///   10 `[writable]` Obligation account - refreshed.
///   11 `[]` Lending market account.
///   12 `[]` Derived lending market authority.
///   13 `[signer]` User transfer authority ($authority).
///   14 `[]` Token program id.
export const LiquidateObligationAndRedeemReserveCollateral = (
  config: Config,
  liquidityAmount: number | BN | string,
  sourceLiquidity: PublicKey,
  destinationCollateral: PublicKey,
  destinationRewardLiquidity: PublicKey,
  repayReserve: PublicKey,
  repayReserveLiquiditySupply: PublicKey,
  withdrawReserve: PublicKey,
  withdrawReserveCollateralMint: PublicKey,
  withdrawReserveCollateralSupply: PublicKey,
  withdrawReserveLiquiditySupply: PublicKey,
  withdrawReserveFeeReceiver: PublicKey,
  obligation: PublicKey,
  lendingMarket: PublicKey,
  lendingMarketAuthority: PublicKey,
  transferAuthority: PublicKey,
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('liquidityAmount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.LiquidateObligationAndRedeemReserveCollateral,
      liquidityAmount: new BN(liquidityAmount),
    },
    data,
  );

  const keys = [
    { pubkey: sourceLiquidity, isSigner: false, isWritable: true },
    { pubkey: destinationCollateral, isSigner: false, isWritable: true },
    { pubkey: destinationRewardLiquidity, isSigner: false, isWritable: true },
    { pubkey: repayReserve, isSigner: false, isWritable: true },
    { pubkey: repayReserveLiquiditySupply, isSigner: false, isWritable: true },
    { pubkey: withdrawReserve, isSigner: false, isWritable: true },
    { pubkey: withdrawReserveCollateralMint, isSigner: false, isWritable: true },
    {
      pubkey: withdrawReserveCollateralSupply,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: withdrawReserveLiquiditySupply, isSigner: false, isWritable: true },
    { pubkey: withdrawReserveFeeReceiver, isSigner: false, isWritable: true },
    { pubkey: obligation, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },
    { pubkey: transferAuthority, isSigner: true, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(config.programID),
    data,
  });
};
