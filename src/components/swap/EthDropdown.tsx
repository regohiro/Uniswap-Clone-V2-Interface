import React from "react";
import { InputGroup } from "react-bootstrap";
import styled from "styled-components";
import styles from "./SwapInterface.module.css";

const Img = styled.img`
  width: 30px;
  height: 30px;
  margin-left: 10px;
`;

const EthDropdown = (): JSX.Element => {
  return (
    <InputGroup.Text className={styles.inputGroupText}>
      <Img src="./eth.png" alt="Eth" />
      &nbsp;&nbsp;ETH
    </InputGroup.Text>
  );
};

export default EthDropdown;
