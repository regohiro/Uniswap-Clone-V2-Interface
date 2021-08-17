import React, { useState } from "react";
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
  const { updateProvider, updateUserInfo, setTxHash } = bindActionCreators(
    userActions,
    useDispatch()
  );

  const [isHovering, setHover] = useState<boolean>(false);

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
      setHover(false)
    }
  };

  const onClickDisconnect = async () => {
    const data = await disconnectWallet(host);
    const { host: newHost, provider, signer, address, txHash } = data;
    updateProvider({ host: newHost, provider });
    updateUserInfo({ signer, address });
    setTxHash(txHash);
  };

  return (
    <>
      <Button
        variant="warning"
        onClick={!address ? onClickConnect : onClickDisconnect}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={pending}
        size="lg"
        style={{ width: "160px" }}
      >
        {pending ? (
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
          />
        ) : address ? (
          isHovering ? (
            "Disconnect"
          ) : (
            "Connected"
          )
        ) : (
          "Connet Wallet"
        )}
      </Button>
    </>
  );
};

export default ConnectButton;
