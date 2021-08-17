import { ERC20, ERC20__factory, Dex, Dex__factory } from "./abis/types";
import { TSignerProvider } from "./../connectors";

export type TokenType = "Dai" | "Link" | "Uni";

export const daiAddr = "0x3Dada1665B380182bCb2Fd0EC5350aa642E30CF2";
export const linkAddr = "0xab3361E094463A9E27368854210fA2E32Fd09a23";
export const uniAddr = "0x66D44e4481AE436Bb635b741aA9161C4381E315F";
export const dexAddr = "0xeeE74B877F1d8ab44a631661A7e0E5b081B453e0";

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