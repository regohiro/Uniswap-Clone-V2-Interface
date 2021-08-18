import React from "react";
import { InputGroup } from "react-bootstrap";
import styles from "./SwapInterface.module.css";
import Image from "next/image";

const EthDropdown = (): JSX.Element => {
  return (
    <InputGroup.Text className={styles.inputGroupText}>
      <Image src="/eth.png" alt="Eth" width={30} height={30}/>
      <text>&nbsp;&nbsp;ETH</text>
    </InputGroup.Text>
  );
};

export default EthDropdown;
