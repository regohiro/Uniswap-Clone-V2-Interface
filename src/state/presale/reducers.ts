import { updateBuyLimit, updateRemaining } from './actions';
import { createReducer } from "@reduxjs/toolkit";

export interface IState {
  buyLimit: number;
  remaining: number;
}

export const initialState: IState = {
  buyLimit: 20,
  remaining: 250000000000000
}

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(updateBuyLimit, (state, {payload: buyLimit}) => {
      return {
        ...state,
        buyLimit
      }
    })
    .addCase(updateRemaining, (state, {payload: remaining}) => {
      return {
        ...state,
        remaining
      }
    })
})