import { presaleAddr, getPresaleInstance } from "./../contracts/index";
import { BigNumber } from "ethers";
import { TSignerProvider } from "./../connectors";
import { getTokenInstance } from "./../contracts";
import { networkId } from "../connectors/network-config";
import { fromWei, toWei } from "../utils";
import { JsonRpcSigner } from "@ethersproject/providers";

export const getRemaining = async (signerOrProvider: TSignerProvider): Promise<BigNumber> => {
  const token = await getTokenInstance(signerOrProvider);
  const remaining = await token.balanceOf(presaleAddr);
  return remaining;
};

export const getBuyLimit = async (
  signer: JsonRpcSigner
): Promise<BigNumber> => {
  const presale = await getPresaleInstance(signer);
  const userAddr = await signer.getAddress();
  const caps = await presale.caps();
  const contribution = await presale.contributions(userAddr);
  const buylimit = caps.sub(contribution);
  return buylimit;
};

export const exceedsCap = async (
  signer: JsonRpcSigner,
  amount: BigNumber
): Promise<boolean> => {
  const presale = await getPresaleInstance(signer);
  const caps = await presale.caps();
  const currentLimit = await getBuyLimit(signer);
  return currentLimit.add(amount).gt(caps);
};

export interface IBuyDATPresale {
  txHash: string;
  bnbBalance: number;
  datBalance: number;
  remaining: number;
  buyLimit: number;
}

export const buyDATPresale = async (
  signer: JsonRpcSigner,
  bnbAmount: number 
): Promise<IBuyDATPresale> => {
  const presale = await getPresaleInstance(signer);
  const token = await getTokenInstance(signer);
  const weiAmount = toWei(bnbAmount);
  const userAddr = await signer.getAddress();
  const chainId = await signer.getChainId();

  if(chainId !== networkId){
    throw new Error("Network Error!")
  }

  const isOpen = await presale.isOpen();
  const hasClosed = await presale.hasClosed();
  if (isOpen === false && hasClosed === false) {
    throw new Error("Presale has not started yet!");
  }
  if (isOpen === false && hasClosed === true) {
    throw new Error("Presale has ended!");
  }

  if(await exceedsCap(signer, weiAmount)){
    throw new Error("Exceeds buy limit!");
  }

  try {
    const buyTokenTX = await presale.buyTokens({value: weiAmount});
    const { transactionHash: txHash } = await buyTokenTX.wait();

    const bnbBalance = fromWei(await signer.getBalance());
    const datBalance = fromWei(await token.balanceOf(userAddr), 3);
    const remaining = fromWei(await getRemaining(signer), 3);
    const buyLimit = fromWei(await getBuyLimit(signer));
    
    return {
      txHash, bnbBalance, datBalance, remaining, buyLimit
    }

  } catch(error: any) {
    throw new Error(error.message);
  }
};
