import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import EthDropdown from "./EthDropdown";
import styles from "./SwapInterface.module.css";
import TokenDropdown from "./TokenDropdown";

const SwapInterface = (): JSX.Element => {

  

  return (
    <main className={styles.main}>
      <Form className={styles.box}>
        <InputGroup className={styles.inputGroup} id={styles.top}>
          <Form.Control
            className={styles.formControl}
            id={styles.topFormControl}
            type="number"
            placeholder="0.00"
            required
          />
          <EthDropdown />
        </InputGroup>
        <div id="arrow-box">
          <h2>↓</h2>
        </div>
        <InputGroup
          className={styles.inputGroup}
          id={styles.bottom}
        >
          <Form.Control
            className={styles.formControl}
            id={styles.bottomFormControl}
            type="number"
            placeholder="0.00"
            disabled
          />
          <TokenDropdown />
        </InputGroup>
        
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
