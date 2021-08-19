import React, { useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import useAsyncEffect from "use-async-effect";
import { selectSwap, selectUser } from "../../state";
import * as swapActions from "../../state/swap/actions";
import * as userActions from "../../state/user/actions";
import EthDropdown from "./EthDropdown";
import styles from "./SwapInterface.module.css";
import TokenDropdown from "./TokenDropdown";
import {
  approveToken,
  getAmount,
  hasApprovedToken,
  hasEnoughBalance,
  swapToken,
} from "../../interactions/swap";
import { useAsync } from "../../hooks";
import { connectWallet } from "../../interactions/connectwallet";
import { JsonRpcSigner } from "@ethersproject/providers";
import { TokenType } from "../../contracts";
import { TSwapDirection } from "../../state/swap/reducers";

const SwapInterface = (): JSX.Element => {
  const { address, signer } = useSelector(selectUser);
  const { swapDirection, value, amount, tokenType, approved } =
    useSelector(selectSwap);
  const {
    setSwapDirection,
    setValue,
    setAmount,
    setApproved,
    setTxHash,
    updateProvider,
    updateUserInfo,
  } = bindActionCreators({ ...swapActions, ...userActions }, useDispatch());

  const [hasEnoughFund, setHasEnoughFund] = useState<boolean>(false);

  interface ISwapTokenParam {
    signer: JsonRpcSigner;
    tokenType: TokenType;
    swapDirection: TSwapDirection;
    value: number;
  }
  interface IApproveTokenParam {
    signer: JsonRpcSigner;
    tokenType: TokenType;
  }

  const connectPromi = useAsync(connectWallet);
  const swapPromi = useAsync<ISwapTokenParam, string>(
    async ({ signer, tokenType, swapDirection, value }) =>
      await swapToken(signer, tokenType, swapDirection, value)
  );
  const approvePromi = useAsync<IApproveTokenParam, string>(
    async ({ signer, tokenType }) => await approveToken(signer, tokenType)
  );

  const onClickSwitchDirection = (): void => {
    swapDirection === "BuyToken"
      ? setSwapDirection("SellToken")
      : setSwapDirection("BuyToken");
  };

  const onClickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (address && tokenType && approved) {
      const { error, data } = await swapPromi.call({
        signer,
        tokenType,
        swapDirection,
        value,
      });
      if (error) {
        console.error(error);
      }
      if (data) {
        setTxHash(data);
      }
    } else if(address && tokenType && !approved  && swapDirection === "SellToken"){
      const { error, data } = await approvePromi.call({
        signer,
        tokenType
      });
      if (error) {
        console.error(error);
      }
      if (data) {
        setTxHash(data);
      }
    } else if (!address) {
      const { error, data } = await connectPromi.call(null);
      if (error) {
        console.error(error);
      }
      if (data) {
        const { host, provider, signer, address } = data;
        updateProvider({ host, provider });
        updateUserInfo({ signer, address });
      }
    }
  };

  useAsyncEffect(async () => {
    if (value && tokenType) {
      setHasEnoughFund(false);

      const amount = await getAmount(tokenType, swapDirection, value);
      setAmount(amount);
      
      if (address) {
        let tokenToCheck: TokenType | "Eth";
        switch (swapDirection) {
          case "BuyToken":
            tokenToCheck = "Eth";
            break;
          case "SellToken":
            tokenToCheck = tokenType;
            const allowanceCheckResult = await hasApprovedToken(
              address,
              tokenToCheck,
              value
            );
            setApproved(allowanceCheckResult);
            break;
        }

        const balanceCheckResult = await hasEnoughBalance(
          address,
          tokenToCheck,
          value
        );
        setHasEnoughFund(balanceCheckResult);
      }
    } else if (value === 0) {
      setAmount(0);
    }
  }, [value, tokenType, swapDirection, address]);

  return (
    <main className={styles.main}>
      <Form className={styles.box} onSubmit={onClickSubmit}>
        <InputGroup className={styles.inputGroup} id={styles.top}>
          <Form.Control
            className={styles.formControl}
            id={styles.topFormControl}
            type="number"
            min="0"
            step="0.0000001"
            placeholder="0.00"
            onChange={(e) => setValue(Number(e.target.value))}
            required={address ? true : false}
          />
          {swapDirection === "BuyToken" ? <EthDropdown /> : <TokenDropdown />}
        </InputGroup>
        <div className={styles.arrowBox}>
          <h2 onClick={onClickSwitchDirection}>↓</h2>
        </div>
        <InputGroup className={styles.inputGroup} id={styles.bottom}>
          <Form.Control
            className={styles.formControl}
            id={styles.bottomFormControl}
            type="number"
            placeholder="0.00"
            value={amount === 0 ? "" : amount.toFixed(7)}
            disabled
          />
          {swapDirection === "BuyToken" ? <TokenDropdown /> : <EthDropdown />}
        </InputGroup>
        <div className={styles.rateBox}>
          <span className={styles.rateText}>Exchange Rate</span>
          <span className={styles.rateValue}>1 ETH = 1000 DAI</span>
        </div>
        <Button
          variant="primary"
          type="submit"
          disabled={
            connectPromi.pending ||
            swapPromi.pending ||
            approvePromi.pending ||
            (address !== "" && !hasEnoughFund)
          }
          className={styles.btn}
        >
          {connectPromi.pending || swapPromi.pending || approvePromi.pending ? (
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
            />
          ) : address ? (
            value === 0 ? (
              "Enter an Amount"
            ) : hasEnoughFund ? (
              approved || swapDirection === "BuyToken" ? (
                "Swap"
              ) : (
                "Approve token"
              )
            ) : tokenType ? (
              "Insufficient Balance"
            ) : (
              "Select a Token"
            )
          ) : (
            "Connet to a Wallet"
          )}
        </Button>
      </Form>
    </main>
  );
};

export default SwapInterface;
