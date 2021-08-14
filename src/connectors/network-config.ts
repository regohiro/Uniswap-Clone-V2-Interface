import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import Torus from "@toruslabs/torus.js";

export const networkId = 4;

export const defaultRPCURL =
  "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

const providerOptions = {
  injected: {
    package: null,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        4: defaultRPCURL,
      },
    },
  },
  torus: {
    package: Torus,
    options: {
      networkParams: {
        host: defaultRPCURL,
        chainId: 4,
        networkId: 4,
      },
    },
  },
  authereum: {
    package: Authereum,
  },
};

const getWeb3Modal = () => {
  if (typeof window !== "undefined") {
    return new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions,
      theme: "dark",
    });
  } else {
    return undefined;
  }
};

export const web3Modal = getWeb3Modal();

type TNetWorkData = {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
};

export const getNetworkData = (netId: number): TNetWorkData | undefined => {
  switch (netId) {
    case 4: {
      return {
        chainId: "0x4",
        chainName: "Rinkeby",
        rpcUrls: [defaultRPCURL],
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
      };
    }
    case 56: {
      return {
        chainId: "0x38",
        chainName: "BSCMAINET",
        rpcUrls: ["https://bsc-dataseed.binance.org"],
        nativeCurrency: {
          name: "BINANCE COIN",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com"],
      };
    }
    default:
      return undefined;
  }
};
