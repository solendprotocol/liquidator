import { AccountInfo, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from 'libs/layout';
import BigNumber from 'bignumber.js';
import { LastUpdate, LastUpdateLayout } from './lastUpdate';

export const RESERVE_LEN = 619;
export const WAD = new BigNumber(1000000000000000000);

const INITIAL_COLLATERAL_RATIO = 1;
const INITIAL_COLLATERAL_RATE = new BigNumber(INITIAL_COLLATERAL_RATIO).multipliedBy(WAD);
export interface Reserve {
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  liquidity: ReserveLiquidity;
  collateral: ReserveCollateral;
  config: ReserveConfig;
}

export interface ReserveLiquidity {
  mintPubkey: PublicKey;
  mintDecimals: number;
  supplyPubkey: PublicKey;
  // @FIXME: oracle option
  oracleOption: number;
  pythOraclePubkey: PublicKey;
  switchboardOraclePubkey: PublicKey;
  availableAmount: BN;
  borrowedAmountWads: BN;
  cumulativeBorrowRateWads: BN;
  marketPrice: BN;
}

export interface ReserveCollateral {
  mintPubkey: PublicKey;
  mintTotalSupply: BN;
  supplyPubkey: PublicKey;
}

export interface ReserveConfig {
  optimalUtilizationRate: number;
  loanToValueRatio: number;
  liquidationBonus: number;
  liquidationThreshold: number;
  minBorrowRate: number;
  optimalBorrowRate: number;
  maxBorrowRate: number;
  fees: {
    borrowFeeWad: BN;
    hostFeePercentage: number;
  };
  depositLimit: BN;
}

export const ReserveLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    BufferLayout.u8('version'),

    LastUpdateLayout,

    Layout.publicKey('lendingMarket'),

    BufferLayout.struct(
      [
        Layout.publicKey('mintPubkey'),
        BufferLayout.u8('mintDecimals'),
        Layout.publicKey('supplyPubkey'),
        // @FIXME: oracle option
        // TODO: replace u32 option with generic equivalent
        // BufferLayout.u32('oracleOption'),
        Layout.publicKey('pythOracle'),
        Layout.publicKey('switchboardOracle'),
        Layout.uint64('availableAmount'),
        Layout.uint128('borrowedAmountWads'),
        Layout.uint128('cumulativeBorrowRateWads'),
        Layout.uint128('marketPrice'),
      ],
      'liquidity',
    ),

    BufferLayout.struct(
      [
        Layout.publicKey('mintPubkey'),
        Layout.uint64('mintTotalSupply'),
        Layout.publicKey('supplyPubkey'),
      ],
      'collateral',
    ),

    BufferLayout.struct(
      [
        BufferLayout.u8('optimalUtilizationRate'),
        BufferLayout.u8('loanToValueRatio'),
        BufferLayout.u8('liquidationBonus'),
        BufferLayout.u8('liquidationThreshold'),
        BufferLayout.u8('minBorrowRate'),
        BufferLayout.u8('optimalBorrowRate'),
        BufferLayout.u8('maxBorrowRate'),
        BufferLayout.struct(
          [
            Layout.uint64('borrowFeeWad'),
            Layout.uint64('flashLoanFeeWad'),
            BufferLayout.u8('hostFeePercentage'),
          ],
          'fees',
        ),
        Layout.uint64('depositLimit'),
        Layout.uint64('borrowLimit'),
        Layout.publicKey('feeReceiver'),
      ],
      'config',
    ),

    BufferLayout.blob(256, 'padding'),
  ],
);

export const isReserve = (info: AccountInfo<Buffer>) => info.data.length === ReserveLayout.span;

export const ReserveParser = (pubkey: PublicKey, info: AccountInfo<Buffer>) => {
  const buffer = Buffer.from(info.data);
  const reserve = ReserveLayout.decode(buffer) as Reserve;

  if (reserve.lastUpdate.slot.isZero()) {
    return null;
  }

  const details = {
    pubkey,
    account: {
      ...info,
    },
    info: reserve,
  };

  return details;
};

export const getCollateralExchangeRate = (reserve: Reserve): BigNumber => {
  const totalLiquidity = (new BigNumber(reserve.liquidity.availableAmount.toString()).multipliedBy(WAD))
    .plus(new BigNumber(reserve.liquidity.borrowedAmountWads.toString()));

  const { collateral } = reserve;
  let rate;
  if (collateral.mintTotalSupply.isZero() || totalLiquidity.isZero()) {
    rate = INITIAL_COLLATERAL_RATE;
  } else {
    const { mintTotalSupply } = collateral;
    rate = (new BigNumber(mintTotalSupply.toString()).multipliedBy(WAD))
      .dividedBy(new BigNumber(totalLiquidity.toString()));
  }
  return rate;
};

export const getLoanToValueRate = (reserve: Reserve): BigNumber => new BigNumber(
  reserve.config.loanToValueRatio / 100,
);

export const getLiquidationThresholdRate = (reserve: Reserve): BigNumber => new BigNumber(
  reserve.config.liquidationThreshold / 100,
);
