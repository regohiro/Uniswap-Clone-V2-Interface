import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../state';
import { bindActionCreators } from "redux";
import * as userActions from "../../state/user/actions";
import { disconnectWallet } from '../../interactions/connectwallet';
import { networkId } from '../../connectors/network-config';

const EventListener = (): JSX.Element => {
  const { host, provider, address } = useSelector(selectUser);
  const { updateProvider, updateUserInfo, setTxHash } = bindActionCreators(
    userActions,
    useDispatch()
  );

  useEffect(() => {
    if(!address) return;

    const resetAccount = async () => {
      const data = await disconnectWallet(host);
      const { host: newHost, provider, signer, address, txHash } = data;
      updateProvider({ host: newHost, provider });
      updateUserInfo({ signer, address });
      setTxHash(txHash);
    };

    const handleAccountChange = (accounts: string[]) => {
      console.log(`Account changed: ${accounts}`)
      if(accounts){
        const signer = provider.getSigner();
        const address = accounts[0];
        updateUserInfo({signer, address});
      }else{
        resetAccount();
      } 
    };

    const handleChainChange = (chainId: number) => {
      console.log(`Network changed: ${chainId}`)
      if(chainId !== networkId){
        resetAccount();
      }
    }

    host.on("accountsChanged", handleAccountChange);
    host.on("chainChanged", handleChainChange);
    host.on("disconnect", resetAccount);

    return () => {
      host.removeListener("accountsChanged", handleAccountChange)
      host.removeListener("chainChanged", handleChainChange)
      host.removeListener("disconnect", resetAccount) 
    }

  }, [address]);
 
  return (
    <></>
  )
}
 
export default EventListener
   