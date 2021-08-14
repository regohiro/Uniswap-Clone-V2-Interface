import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "semantic-ui-react";
import useAsync from "../../hooks/useAsync";
import {
  connectWallet,
  disconnectWallet,
} from "../../interactions/connectwallet";
import { selectUser } from "../../state";
import * as userActions from "../../state/user/actions";

const AccountDetails = () => {
  const { address, bnbBalance, datBalance, host } =
    useSelector(selectUser);
  const { updateProvider, updateUserBalance, updateUserInfo, setTxHash } =
    bindActionCreators(userActions, useDispatch());

  const { pending, error, call } = useAsync(connectWallet);

  const onClickConnect = async () => {
    const { error, data } = await call(null);
    if (error) {
      console.error(error);
    }
    if (data) {
      const {
        host,
        provider,
        signer,
        address,
        bnbBalance,
        datBalance,
      } = data;
      updateProvider({ host, provider });
      updateUserInfo({ signer, address });
      updateUserBalance({ bnbBalance, datBalance });
    }
  };

  const onClickDisconnect = async () => {
    const data = await disconnectWallet(host);
    const {
      host: newHost,
      provider,
      signer,
      address,
      bnbBalance,
      datBalance,
      txHash
    } = data;
    updateProvider({ host: newHost, provider });
    updateUserInfo({ signer, address });
    updateUserBalance({ bnbBalance, datBalance });
    setTxHash(txHash);
  };

  return (
    <>
      <h1>Account Info</h1>
      <Button
        color="yellow"
        onClick={onClickConnect}
        disabled={pending}
        loading={pending}
      >
        Connet Wallet
      </Button>
      <Button color="red" onClick={onClickDisconnect}>
        Disconnet
      </Button>
      <div>Account: {address}</div>
      <div>BNB balance: {bnbBalance}</div>
      <div>DAT balance: {datBalance}</div>
    </>
  );
};

export default AccountDetails;
