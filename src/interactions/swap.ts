import { JsonRpcSigner } from "@ethersproject/providers";
import { ContractTransaction } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import { getDefaultProvider } from "../connectors";
import {
  dexAddr,
  getDexInstance,
  getTokenInstance,
  TokenType,
  getTokenAddr,
} from "../contracts";
import { TSwapDirection } from "../state/swap/reducers";
import { fromWei, tenPow18, toWei } from "../utils";

export const getAmount = async (
  tokenType: TokenType,
  swapDirection: TSwapDirection,
  value: number
): Promise<number> => {
  const provider = getDefaultProvider();
  const dex = await getDexInstance(provider);
  const tokenAddr = getTokenAddr(tokenType);
  const priceBN = await dex.getPrice(tokenAddr);

  switch (swapDirection) {
    case "BuyToken":
      return fromWei(toWei(value).mul(tenPow18).div(priceBN));
    case "SellToken":
      return fromWei(toWei(value).mul(priceBN).div(tenPow18));
  }
};

export const hasEnoughBalance = async (
  userAddr: string,
  tokenType: TokenType | "Eth",
  amount: number
): Promise<boolean> => {
  const provider = getDefaultProvider();
  const amountWei = toWei(amount);
  let userBalance: BigNumber;

  if (tokenType === "Eth") {
    userBalance = await provider.getBalance(userAddr);
  } else {
    const token = await getTokenInstance(provider, tokenType);
    userBalance = await token.balanceOf(userAddr);
  }
  return userBalance.gte(amountWei) ? true : false;
};

export const hasApprovedToken = async (
  userAddr: string,
  tokenType: TokenType,
  value: number
): Promise<boolean> => {
  const provider = getDefaultProvider();
  const token = await getTokenInstance(provider, tokenType);
  const valueWei = toWei(value);
  const tokenAllowance = await token.allowance(userAddr, dexAddr);
  return tokenAllowance.gte(valueWei) ? true : false;
};

export const approveToken = async (
  signer: JsonRpcSigner,
  tokenType: TokenType
): Promise<string> => {
  const token = await getTokenInstance(signer, tokenType);
  const approveAmount = await token.totalSupply();

  try {
    const approveTokenTx = await token.approve(dexAddr, approveAmount);
    const { transactionHash: txHash } = await approveTokenTx.wait();
    return txHash;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const swapToken = async (
  signer: JsonRpcSigner,
  tokenType: TokenType,
  swapDirection: TSwapDirection,
  value: number
): Promise<string> => {
  const valueWei = toWei(value);
  const dex = await getDexInstance(signer);
  const tokenAddr = getTokenAddr(tokenType);

  try {
    let swapTx: ContractTransaction;
    switch (swapDirection) {
      case "BuyToken":
        swapTx = await dex.buyToken(tokenAddr, { value: valueWei });
      case "SellToken":
        swapTx = await dex.sellToken(tokenAddr, valueWei);
    }
    const { transactionHash: txHash } = await swapTx.wait();
    
    return txHash;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
