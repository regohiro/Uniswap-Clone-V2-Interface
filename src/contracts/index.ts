import { Presale, Presale__factory, Token, Token__factory } from './abis/types';
import { TSignerProvider } from './../connectors';

export const presaleAddr = "0xdB5eBA9f3fd31A18D8FBdE146750b0FA2be9354B";
export const tokenAddr = "0x5a884042e50c2282d185CE9d844F5200f5597b42";

const checkSigner = async (signerOrProvider: TSignerProvider) => {
  if(signerOrProvider.constructor.name === "JsonRpcSigner"){
    try {
      //@ts-ignore
      await signerOrProvider.getAddress();
    } catch (error) {
      throw new Error("Connect Wallet!")
    }
  }
}

export const getPresaleInstance = async (signerOrProvider: TSignerProvider): Promise<Presale> => {
  await checkSigner(signerOrProvider);
  const contract = Presale__factory.connect(presaleAddr, signerOrProvider);
  return contract;
}

export const getTokenInstance = async (signerOrProvider: TSignerProvider): Promise<Token> => {
  await checkSigner(signerOrProvider);
  const contract = Token__factory.connect(tokenAddr, signerOrProvider);
  return contract;
}