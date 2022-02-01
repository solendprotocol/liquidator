import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey, SYSVAR_CLOCK_PUBKEY, TransactionInstruction,
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
///   2. `[writable]` Repay reserve account - refreshed.
///   3. `[writable]` Repay reserve liquidity supply SPL Token account.
///   4. `[]` Withdraw reserve account - refreshed.
///   5. `[writable]` Withdraw reserve collateral supply SPL Token account.
///   6. `[writable]` Obligation account - refreshed.
///   7. `[]` Lending market account.
///   8. `[]` Derived lending market authority.
///   9. `[signer]` User transfer authority ($authority).
///   10 `[]` Clock sysvar.
///   11 `[]` Token program id.
export const liquidateObligationInstruction = (
  config: Config,
  liquidityAmount: number | BN | string,
  sourceLiquidity: PublicKey,
  destinationCollateral: PublicKey,
  repayReserve: PublicKey,
  repayReserveLiquiditySupply: PublicKey,
  withdrawReserve: PublicKey,
  withdrawReserveCollateralSupply: PublicKey,
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
      instruction: LendingInstruction.LiquidateObligation,
      liquidityAmount: new BN(liquidityAmount),
    },
    data,
  );

  console.log('repay reserve', repayReserve.toString());
  console.log('withdraw reserve', withdrawReserve.toString());

  const keys = [
    { pubkey: sourceLiquidity, isSigner: false, isWritable: true },
    { pubkey: destinationCollateral, isSigner: false, isWritable: true },
    { pubkey: repayReserve, isSigner: false, isWritable: true },
    { pubkey: repayReserveLiquiditySupply, isSigner: false, isWritable: true },
    { pubkey: withdrawReserve, isSigner: false, isWritable: false },
    {
      pubkey: withdrawReserveCollateralSupply,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: obligation, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },
    { pubkey: transferAuthority, isSigner: true, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: new PublicKey(config.programID),
    data,
  });
};
