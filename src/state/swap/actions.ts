import { createAction } from "@reduxjs/toolkit";
import { TokenType } from "../../contracts";
import { TSwapDirection } from "./reducers";

export const setOrder = createAction<{
  swapDirection: TSwapDirection;
  tokenType: TokenType;
  value: number;
}>("swap/setOrder");

export const setAmount = createAction<number>("swap/setAmount");