import React from "react";
import Head from "next/head";
import styled from "styled-components";
import PresaleInfo from "../src/components/presale/PresaleInfo";
import BuyModal from "../src/components/presale/BuyModal";
import PresaleSteps from "../src/components/presale/PresaleSteps";
import AccountDetails from "../src/components/account";

const PresalePage = styled.div`
  /* background-color: red; */
`

const Presale: React.FC = () => {
  return (
    <>
      <Head>
        <title>DontApeThis Presale</title>
        <meta name="description" content="Private presale for DAT token!" />
      </Head>
      <PresalePage>
        <PresaleInfo/>
        <AccountDetails/>
        <BuyModal/> 
        <PresaleSteps/>
      </PresalePage>
    </>
  );
};

export default Presale;