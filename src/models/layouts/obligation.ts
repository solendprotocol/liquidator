import { AccountInfo, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from 'libs/layout';
import { LastUpdate, LastUpdateLayout } from './lastUpdate';

export const OBLIGATION_LEN = 1300;

export interface Obligation {
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  owner: PublicKey;
  // @FIXME: check usages
  deposits: ObligationCollateral[];
  // @FIXME: check usages
  borrows: ObligationLiquidity[];
  depositedValue: BN; // decimals
  borrowedValue: BN; // decimals
  allowedBorrowValue: BN; // decimals
  unhealthyBorrowValue: BN; // decimals
}

// BN defines toJSON property, which messes up serialization
// @ts-ignore
BN.prototype.toJSON = undefined;

export function obligationToString(obligation: Obligation) {
  return JSON.stringify(
    obligation,
    (key, value) => {
      switch (value.constructor.name) {
        case 'PublicKey':
          return value.toBase58();
        case 'BN':
          return value.toString();
        default:
          return value;
      }
    },
    2,
  );
}

export interface ObligationCollateral {
  depositReserve: PublicKey;
  depositedAmount: BN;
  marketValue: BN; // decimals
}

export interface ObligationLiquidity {
  borrowReserve: PublicKey;
  cumulativeBorrowRateWads: BN; // decimals
  borrowedAmountWads: BN; // decimals
  marketValue: BN; // decimals
}

export const ObligationLayout: typeof BufferLayout.Structure = BufferLayout.struct([
  BufferLayout.u8('version'),

  LastUpdateLayout,

  Layout.publicKey('lendingMarket'),
  Layout.publicKey('owner'),
  Layout.uint128('depositedValue'),
  Layout.uint128('borrowedValue'),
  Layout.uint128('allowedBorrowValue'),
  Layout.uint128('unhealthyBorrowValue'),
  BufferLayout.blob(64, '_padding'),

  BufferLayout.u8('depositsLen'),
  BufferLayout.u8('borrowsLen'),
  BufferLayout.blob(1096, 'dataFlat'),
]);

export const ObligationCollateralLayout: typeof BufferLayout.Structure = BufferLayout.struct([
  Layout.publicKey('depositReserve'),
  Layout.uint64('depositedAmount'),
  Layout.uint128('marketValue'),
  BufferLayout.blob(32, 'padding'),
]);

export const ObligationLiquidityLayout: typeof BufferLayout.Structure = BufferLayout.struct([
  Layout.publicKey('borrowReserve'),
  Layout.uint128('cumulativeBorrowRateWads'),
  Layout.uint128('borrowedAmountWads'),
  Layout.uint128('marketValue'),
  BufferLayout.blob(32, 'padding'),
]);

export const isObligation = (info: AccountInfo<Buffer>) => info.data.length === ObligationLayout.span;

export interface ProtoObligation {
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  owner: PublicKey;
  depositedValue: BN; // decimals
  borrowedValue: BN; // decimals
  allowedBorrowValue: BN; // decimals
  unhealthyBorrowValue: BN; // decimals
  depositsLen: number;
  borrowsLen: number;
  dataFlat: Buffer;
}

export const ObligationParser = (
  pubkey: PublicKey,
  info: AccountInfo<Buffer>,
) => {
  const buffer = Buffer.from(info.data);
  const {
    version,
    lastUpdate,
    lendingMarket,
    owner,
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    depositsLen,
    borrowsLen,
    dataFlat,
  } = ObligationLayout.decode(buffer) as ProtoObligation;

  if (lastUpdate.slot.isZero()) {
    return null;
  }

  const depositsBuffer = dataFlat.slice(
    0,
    depositsLen * ObligationCollateralLayout.span,
  );
  const deposits = BufferLayout.seq(
    ObligationCollateralLayout,
    depositsLen,
  ).decode(depositsBuffer) as ObligationCollateral[];

  const borrowsBuffer = dataFlat.slice(
    depositsBuffer.length,
    depositsLen * ObligationCollateralLayout.span
      + borrowsLen * ObligationLiquidityLayout.span,
  );
  const borrows = BufferLayout.seq(
    ObligationLiquidityLayout,
    borrowsLen,
  ).decode(borrowsBuffer) as ObligationLiquidity[];

  const obligation = {
    version,
    lastUpdate,
    lendingMarket,
    owner,
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    deposits,
    borrows,
  } as Obligation;

  const details = {
    pubkey,
    account: {
      ...info,
    },
    info: obligation,
  };

  return details;
};
