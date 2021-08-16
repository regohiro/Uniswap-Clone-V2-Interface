import { ERC20, ERC20__factory, Dex, Dex__factory } from "./abis/types";
import { TSignerProvider } from "./../connectors";

export type TokenType = "Dai" | "Link" | "Uni";

export const daiAddr = "";
export const linkAddr = "";
export const uniAddr = "";
export const dexAddr = "";


const checkSigner = async (signerOrProvider: TSignerProvider) => {
  if (signerOrProvider.constructor.name === "JsonRpcSigner") {
    try {
      //@ts-ignore
      await signerOrProvider.getAddress();
    } catch (error) {
      throw new Error("Connect Wallet!");
    }
  }
};

export const getTokenInstance = async (
  signerOrProvider: TSignerProvider,
  token: TokenType
): Promise<ERC20> => {
  await checkSigner(signerOrProvider);
  let tokenAddr;
  switch (token) {
    case "Dai":
      tokenAddr = daiAddr;
      break;
    case "Link":
      tokenAddr = linkAddr;
      break;
    case "Uni":
      tokenAddr = uniAddr;
      break;
    default:
      tokenAddr = "";
      break;
  }
  return ERC20__factory.connect(daiAddr, signerOrProvider);
};

export const getDexInstance = async (
  signerOrProvider: TSignerProvider
): Promise<Dex> => {
  await checkSigner(signerOrProvider);
  return Dex__factory.connect(dexAddr, signerOrProvider);
};