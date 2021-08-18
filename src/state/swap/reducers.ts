import { createReducer } from "@reduxjs/toolkit";
import { TokenType } from "../../contracts";
import { setAmount, setSwapDirection, setTokenType, setValue } from "./actions";

export type TSwapDirection = "BuyToken" | "SellToken";
interface IState {
  swapDirection: TSwapDirection;
  tokenType: TokenType | undefined;
  value: number;
  amount: number;
}

const initialState: IState = {
  swapDirection: "BuyToken",
  tokenType: undefined,
  value: 0,
  amount: 0
}

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(setSwapDirection, (state, { payload: swapDirection }) => {
      return {
        ...state,
        swapDirection
      }
    })
    .addCase(setTokenType, (state, { payload: tokenType }) => {
      return {
        ...state,
        tokenType
      }
    })
    .addCase(setValue, (state, { payload: value }) => {
      return {
        ...state,
        value
      }
    })
    .addCase(setAmount, (state, { payload: amount }) => {
      return {
        ...state,
        amount
      }
    });
});