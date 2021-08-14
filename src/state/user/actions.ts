import { TProvider } from './../../connectors';
import { JsonRpcSigner } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";

export const updateProvider = createAction<{
  host: any;
  provider: TProvider;
}>("user/updateProvider");

export const updateUserInfo = createAction<{
  signer: JsonRpcSigner;
  address: string;
}>("user/updateUserInfo");

export const updateUserBalance = createAction<{
  bnbBalance?: number;
  datBalance?: number;
}>("user/updateUserBalance");

export const setTxHash = createAction<string>("user/setTxHash");