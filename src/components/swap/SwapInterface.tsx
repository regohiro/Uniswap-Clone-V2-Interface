import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { selectSwap } from "../../state";
import * as swapActions from "../../state/swap/actions";
import EthDropdown from "./EthDropdown";
import styles from "./SwapInterface.module.css";
import TokenDropdown from "./TokenDropdown";

const SwapInterface = (): JSX.Element => {
  const { swapDirection, value } = useSelector(selectSwap)
  const { setSwapDirection, setValue } = bindActionCreators(swapActions, useDispatch());

  const onClickSwitchDirection = (): void => {
    swapDirection === "BuyToken"
      ? setSwapDirection("SellToken")
      : setSwapDirection("BuyToken");
  };

  const onClickSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <main className={styles.main}>
      <Form className={styles.box} onSubmit={onClickSubmit}>
        <InputGroup className={styles.inputGroup} id={styles.top}>
          <Form.Control
            className={styles.formControl}
            id={styles.topFormControl}
            type="number"
            min="0"
            step="0.00001"
            placeholder="0.00"
            onChange={(e) => setValue(Number(e))}
            required
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
          disabled={false}
          className={styles.btn}
        >
          Swap
        </Button>
      </Form>
    </main>
  );
};

export default SwapInterface;
