/* eslint-disable @typescript-eslint/no-throw-literal */
import BigNumber from 'bignumber.js';
import { findWhere, find } from 'underscore';
import { Obligation, ObligationCollateral, ObligationLiquidity } from 'models/layouts/obligation';
import {
  getCollateralExchangeRate, getLiquidationThresholdRate, getLoanToValueRate, WAD,
} from 'models/layouts/reserve';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export const RISKY_OBLIGATION_THRESHOLD = 78;

// This function doesn't actually refresh the obligation within the blockchain
// but does offchain calculation which mimics the actual refreshObligation instruction
// to optimize of transaction fees.
export function calculateRefreshedObligation(
  obligation: Obligation,
  obligationpubkey: PublicKey,
  reserves,
  tokensOracle,
) {
  let depositedValue = new BigNumber(0);
  let borrowedValue = new BigNumber(0);
  let allowedBorrowValue = new BigNumber(0);
  let unhealthyBorrowValue = new BigNumber(0);
  const deposits = [] as Deposit[];
  const borrows = [] as Borrow[];

  obligation.deposits.forEach((deposit: ObligationCollateral) => {
    const tokenOracle = findWhere(tokensOracle, { reserveAddress: deposit.depositReserve.toString() });
    if (!tokenOracle) {
      throw `Missing token info for reserve ${deposit.depositReserve.toString()}, skipping this obligation. Please pull the latest @solendprotocol/common package.`;
    }
    const { price, decimals, symbol } = tokenOracle;
    reserves.forEach((r) => console.log(`reserve address ${r.pubkey.toString()}`));
    console.log('depositReserve', deposit.depositReserve.toString());
    const reserve = find(reserves, (r) => r.pubkey.toString() === deposit.depositReserve.toString()).info;

    const collateralExchangeRate = getCollateralExchangeRate(reserve);
    const marketValue = new BigNumber(deposit.depositedAmount.toString())
      .multipliedBy(WAD)
      .dividedBy(collateralExchangeRate)
      .multipliedBy(price)
      .dividedBy(decimals);

    const loanToValueRate = getLoanToValueRate(reserve);
    const liquidationThresholdRate = getLiquidationThresholdRate(reserve);

    depositedValue = depositedValue.plus(marketValue);
    allowedBorrowValue = allowedBorrowValue.plus(marketValue.multipliedBy(loanToValueRate));
    unhealthyBorrowValue = unhealthyBorrowValue.plus(marketValue.multipliedBy(liquidationThresholdRate));

    deposits.push({
      depositReserve: deposit.depositReserve,
      depositAmount: deposit.depositedAmount,
      marketValue,
      symbol,
    });
  });

  obligation.borrows.forEach((borrow: ObligationLiquidity) => {
    const borrowAmountWads = new BigNumber(borrow.borrowedAmountWads.toString());
    const tokenOracle = findWhere(tokensOracle,
      { reserveAddress: borrow.borrowReserve.toString() });
    if (!tokenOracle) {
      throw `Missing token info for reserve ${borrow.borrowReserve.toString()}, skipping this obligation. Please pull the latest @solendprotocol/common package.`;
    }
    const {
      price, decimals, symbol, mintAddress,
    } = tokenOracle;
    reserves.forEach((r) => console.log(`reserve address ${r.pubkey.toString()}`));
    console.log('depositReserve', borrow.borrowReserve.toString());
    const reserve = find(reserves, (r) => r.pubkey.toString() === borrow.borrowReserve.toString()).info;
    const borrowAmountWadsWithInterest = getBorrrowedAmountWadsWithInterest(
      new BigNumber(reserve.liquidity.cumulativeBorrowRateWads.toString()),
      new BigNumber(borrow.cumulativeBorrowRateWads.toString()),
      borrowAmountWads,
    );

    const marketValue = borrowAmountWadsWithInterest
      .multipliedBy(price)
      .dividedBy(decimals);

    borrowedValue = borrowedValue.plus(marketValue);

    borrows.push({
      borrowReserve: borrow.borrowReserve,
      borrowAmountWads: borrow.borrowedAmountWads,
      mintAddress,
      marketValue,
      symbol,
    });
  });

  let utilizationRatio = borrowedValue.dividedBy(depositedValue).multipliedBy(100).toNumber();
  utilizationRatio = Number.isNaN(utilizationRatio) ? 0 : utilizationRatio;

  return {
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    deposits,
    borrows,
    utilizationRatio,
  };
}

function getBorrrowedAmountWadsWithInterest(
  reserveCumulativeBorrowRateWads: BigNumber,
  obligationCumulativeBorrowRateWads: BigNumber,
  obligationBorrowAmountWads: BigNumber,
) {
  switch (reserveCumulativeBorrowRateWads.comparedTo(obligationCumulativeBorrowRateWads)) {
    case -1: {
      // less than
      console.error(`Interest rate cannot be negative.
        reserveCumulativeBorrowRateWadsNum: ${reserveCumulativeBorrowRateWads.toString()} |
        obligationCumulativeBorrowRateWadsNum: ${obligationCumulativeBorrowRateWads.toString()}`);
      return obligationBorrowAmountWads;
    }
    case 0: {
      // do nothing when equal
      return obligationBorrowAmountWads;
    }
    case 1: {
      // greater than
      const compoundInterestRate = reserveCumulativeBorrowRateWads.dividedBy(obligationCumulativeBorrowRateWads);
      return obligationBorrowAmountWads.multipliedBy(compoundInterestRate);
    }
    default: {
      console.log(`Error: getBorrrowedAmountWadsWithInterest() identified invalid comparator.
      reserveCumulativeBorrowRateWadsNum: ${reserveCumulativeBorrowRateWads.toString()} |
      obligationCumulativeBorrowRateWadsNum: ${obligationCumulativeBorrowRateWads.toString()}`);
      return obligationBorrowAmountWads;
    }
  }
}

type Borrow = {
  borrowReserve: PublicKey;
  borrowAmountWads: BN;
  marketValue: BigNumber;
  mintAddress: string,
  symbol: string;
};

type Deposit = {
  depositReserve: PublicKey,
  depositAmount: BN,
  marketValue: BigNumber,
  symbol: string;
};
