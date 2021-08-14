import {
  updateProvider,
  updateUserInfo,
  updateUserBalance,
  setTxHash,
} from "./actions";
import { JsonRpcSigner } from "@ethersproject/providers";
import { createReducer } from "@reduxjs/toolkit";
import { getDefaultProvider, TProvider } from "../../connectors";
import { defaultRPCURL } from "../../connectors/network-config";

const defaultProvider = getDefaultProvider();
const defaultSigner = defaultProvider.getSigner();

export interface IState {
  host: any;
  provider: TProvider;
  signer: JsonRpcSigner;
  address: string;
  bnbBalance: number;
  datBalance: number;
  txHash: string;
}

export const initialState: IState = {
  host: defaultRPCURL,
  provider: defaultProvider,
  signer: defaultSigner,
  address: "",
  bnbBalance: 0,
  datBalance: 0,
  txHash: "",
};

export default createReducer<IState>(initialState, (builder) => {
  builder
    .addCase(
      updateProvider,
      (state, { payload: { host, provider } }) => {
        return {
          ...state,
          host,
          provider,
        };
      }
    )
    .addCase(updateUserInfo, (state, { payload: { signer, address } }) => {
      return {
        ...state,
        signer,
        address,
      };
    })
    .addCase(updateUserBalance, (state, { payload }) => {
      const bnbBalance = payload.bnbBalance ?? state.bnbBalance;
      const datBalance = payload.datBalance ?? state.datBalance;
      return {
        ...state,
        bnbBalance,
        datBalance,
      };
    })
    .addCase(setTxHash, (state, { payload: txHash }) => {
      return {
        ...state,
        txHash,
      };
    });
});