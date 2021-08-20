import React from "react";
import { useSelector } from "react-redux";
import { selectSwap, selectUser } from "../../state";
import { Button, Spinner } from "react-bootstrap";
import styles from "./SwapButton.module.css";

interface IProps {
  connectPending: boolean;
  swapPending: boolean;
  approvePending: boolean;
  hasEnoughFund: boolean;
}

const SwapButton: React.FC<IProps> = ({
  connectPending,
  swapPending,
  approvePending,
  hasEnoughFund,
}) => {
  const { address } = useSelector(selectUser);
  const { swapDirection, value, tokenType, approved } = useSelector(selectSwap);

  return (
    <Button
      variant="primary"
      type="submit"
      disabled={
        connectPending ||
        swapPending ||
        approvePending ||
        (address !== "" && !hasEnoughFund) ||
        (address !== "" && value === 0)
      }
      className={styles.btn}
    >
      {connectPending || swapPending || approvePending ? (
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
  );
};

export default SwapButton;
