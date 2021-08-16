import { getProvider } from "./../connectors";
import {
  getNetworkData,
  networkId,
  web3Modal,
} from "../connectors/network-config";
import { initialState, IState } from "../state/user/reducers";
import { fromWei } from "../utils";

const addNetwork = async (id: number): Promise<void> => {
  const data = getNetworkData(id);

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: data?.chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [data],
        });
      } catch (error: any) {
        alert("Failed to add network. Please switch to Rinkeby manually");
      }
    }
  }
};

export const connectWallet = async (): Promise<IState> => {
  //@ts-ignore
  let host = await web3Modal.connect();
  let provider = getProvider(host);
  let userNetId = (await provider.getNetwork()).chainId;

  if (host.isMetaMask && userNetId !== networkId) {
    await addNetwork(networkId);
    //@ts-ignore
    host = await web3Modal.connect();
    provider = getProvider(host);
    userNetId = (await provider.getNetwork()).chainId;
    if( userNetId !== networkId ){
      return initialState;
    }
  }

  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const bnbBalance = fromWei(await signer.getBalance());

  return {
    host,
    provider,
    signer,
    address,
    txHash: "",
  };
};

export const disconnectWallet = async (
  host: any
): Promise<IState> => {
  try {
    await host.close();
  } catch (error) {}

  return initialState;
};
