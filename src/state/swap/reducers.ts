import { createReducer } from "@reduxjs/toolkit";
import { setAmount, setOrder } from "./actions";

export type TSwapDirection = "BuyToken" | "SellToken";
interface IState {
  swapDirection: TSwapDirection;
  tokenType: undefined;
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
    .addCase(setOrder, (state, { payload }) => {
      return {
        ...state,
        payload
      }
    })
    .addCase(setAmount, (state, { payload }) => {
      return {
        ...state,
        payload
      }
    });
});