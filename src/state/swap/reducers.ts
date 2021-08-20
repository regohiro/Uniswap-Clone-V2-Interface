import { createReducer } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { TokenType } from "../../contracts";
import { toBN } from "../../utils";
import {
  setAmount,
  setApproved,
  setSwapDirection,
  setTokenType,
  setValue,
  updateTokenState,
} from "./actions";

export type TSwapDirection = "BuyToken" | "SellToken";

export interface ITokenState {
  hasEnoughFund: boolean;
  approved: boolean;
  price: BigNumber;
}

interface IState {
  swapDirection: TSwapDirection;
  tokenType: TokenType | undefined;
  value: number;
  amount: number;
  approved: boolean;
  tokensState: Record<TokenType, ITokenState>;
}

const initialTokenState: ITokenState = {
  hasEnoughFund: false,
  approved: false,
  price: toBN(0),
};

const initialState: IState = {
  swapDirection: "BuyToken",
  tokenType: undefined,
  value: 0,
  amount: 0,
  approved: false,
  tokensState: {
    Dai: initialTokenState,
    Link: initialTokenState,
    Uni: initialTokenState,
  },
};

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(setSwapDirection, (state, { payload: swapDirection }) => {
      return {
        ...state,
        swapDirection,
      };
    })
    .addCase(setTokenType, (state, { payload: tokenType }) => {
      return {
        ...state,
        tokenType,
      };
    })
    .addCase(setValue, (state, { payload: value }) => {
      return {
        ...state,
        value,
      };
    })
    .addCase(setAmount, (state, { payload: amount }) => {
      return {
        ...state,
        amount,
      };
    })
    .addCase(setApproved, (state, { payload: approved }) => {
      return {
        ...state,
        approved,
      };
    })
    .addCase(updateTokenState, (state, { payload }) => {
      const tokensState = {
        ...state.tokensState, ...payload
      }
      return {
        ...state,
        tokensState,
      };
    });
});
