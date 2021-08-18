import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import styled from "styled-components";
import { TokenType } from "../../contracts";
import styles from "./SwapInterface.module.css";
import Image from "next/image";

// const Img = styled.img`
//   width: 30px;
//   height: 30px;
//   margin-left: -5px;
// `;

const DefaultText: React.FC = () => {
  return (
    <>
      Select <br /> Token
    </>
  );
};

const TokenText: React.FC<{ token: TokenType }> = ({ token }) => {
  const imgUrl = `/${token.toLowerCase()}.png`;
  return (
    <div className={styles.dropdownText}>
      <Image src={imgUrl} alt={token} width={30} height={30}/>
      <text>&nbsp;&nbsp;{token.toUpperCase()}</text>
    </div>
  );
};

const TokenDropdown = (): JSX.Element => {
  const [dropdownBtnText, setDropdownText] = useState<JSX.Element>(
    <DefaultText />
  );

  const handleSelect = (e: string | null) => {
    //@ts-ignore
    setDropdownText(<TokenText token={e} />);
  };

  const tokens: Array<TokenType> = ["Dai", "Link", "Uni"];

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle
        variant="outline-secondary"
        className={styles.dropdownBtn}
        bsPrefix="p-0"
      >
        {dropdownBtnText}
      </Dropdown.Toggle>

      <Dropdown.Menu className={styles.dropdownMenu}>
        {tokens.map((token) => (
          <Dropdown.Item eventKey={token} id={token} className={styles.dropdownItem}>
            <TokenText token={token}/>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TokenDropdown;
