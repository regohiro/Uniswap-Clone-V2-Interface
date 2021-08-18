import { createAction } from "@reduxjs/toolkit";
import { TokenType } from "../../contracts";
import { TSwapDirection } from "./reducers";

export const setSwapDirection = createAction<TSwapDirection>("swap/setSwapDirection");
export const setTokenType = createAction<TokenType | undefined>("swap/setTokenType");
export const setValue = createAction<number>("swap/setValue");
export const setAmount = createAction<number>("swap/setAmount");