import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { useAsync } from "../../hooks";
import {
  connectWallet,
  disconnectWallet,
} from "../../interactions/connectwallet";
import { selectUser } from "../../state";
import * as userActions from "../../state/user/actions";

const ConnectButton = () => {
  const { address, host } = useSelector(selectUser);
  const { updateProvider, updateUserInfo, setTxHash } =
    bindActionCreators(userActions, useDispatch());

  const { pending, error, call } = useAsync(connectWallet);

  const onClickConnect = async () => {
    const { error, data } = await call(null);
    if (error) {
      console.error(error);
    }
    if (data) {
      const { host, provider, signer, address } = data;
      updateProvider({ host, provider });
      updateUserInfo({ signer, address });
    }
  };

  const onClickDisconnect = async () => {
    const data = await disconnectWallet(host);
    const {
      host: newHost,
      provider,
      signer,
      address,
      txHash,
    } = data;
    updateProvider({ host: newHost, provider });
    updateUserInfo({ signer, address });
    setTxHash(txHash);
  };

  return (
    <>
      <Button color='yellow' onClick={onClickConnect} disabled={pending}>
        {pending ? (
          "Connect Wallet"
        ) : (
          <Spinner
            as='span'
            animation='border'
            role='status'
            aria-hidden='true'
          />
        )}
      </Button>
    </>
  );
};

export default ConnectButton;