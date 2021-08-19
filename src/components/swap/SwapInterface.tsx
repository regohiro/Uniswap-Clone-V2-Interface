import React, { useState, useEffect } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import useAsyncEffect from "use-async-effect";
import { selectSwap, selectUser } from "../../state";
import * as swapActions from "../../state/swap/actions";
import * as userActions from "../../state/user/actions";
import * as popupActions from "../../state/popup/actions";
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
import SwapButton from "../SwapButton";

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
    setAlertModal,
    setSuccessModal
  } = bindActionCreators({ ...swapActions, ...userActions, ...popupActions }, useDispatch());

  const [hasEnoughFund, setHasEnoughFund] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);

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

  const onInputChange = (
    e: React.ChangeEvent<typeof FormControl & HTMLInputElement>
  ) => {
    setValue(Number(e.target.value));
    setInputValue(undefined);
  };

  const onClickSwitchDirection = (): void => {
    swapDirection === "BuyToken"
      ? setSwapDirection("SellToken")
      : setSwapDirection("BuyToken");
  };

  const onClickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (address && tokenType && (swapDirection === "BuyToken" || approved)) {
      const { error, data } = await swapPromi.call({
        signer,
        tokenType,
        swapDirection,
        value,
      });
      if (error) {
        console.error(error);
        setAlertModal({
          active: true, title: "Transaction Error!", message: error.message
        })
      }
      if (data) {
        setTxHash(data);
        setSuccessModal({
          active: true, txHash: data, message: "Swap Successful"
        })
      }
    } else if (
      address &&
      tokenType &&
      !approved &&
      swapDirection === "SellToken"
    ) {
      const { error, data } = await approvePromi.call({
        signer,
        tokenType,
      });
      if (error) {
        console.error(error);
        setAlertModal({
          active: true, title: "Transaction Error!", message: error.message
        })
      }
      if (data) {
        setTxHash(data);
        setSuccessModal({
          active: true, txHash: data, message: "Approve Successful"
        })
      }
    } else if (!address) {
      const { error, data } = await connectPromi.call(null);
      if (error) {
        console.error(error);
        setAlertModal({
          active: true, title: "Connection Error!", message: error.message
        }) 
      }
      if (data) { 
        const { host, provider, signer, address } = data;
        updateProvider({ host, provider });
        updateUserInfo({ signer, address });
      }
    }
  };

  useEffect(() => {
    if (amount) {
      setInputValue(amount);
      setValue(amount);
      setAmount(value);
    }
  }, [swapDirection]);

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
  }, [value, tokenType, address]);

  return (
    <main className={styles.main}>
      <Form className={styles.box} onSubmit={onClickSubmit}>
        <InputGroup className={styles.inputGroup} id={styles.top}>
          <Form.Control
            className={styles.formControl}
            id={styles.topFormControl}
            type="number"
            min="0"
            placeholder="0.00"
            step="any"
            onChange={onInputChange}
            value={inputValue}
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

        <SwapButton
          connectPending={connectPromi.pending}
          swapPending={swapPromi.pending}
          approvePending={approvePromi.pending}
          hasEnoughFund={hasEnoughFund}
        />
      </Form>
    </main>
  );
};

export default SwapInterface;
