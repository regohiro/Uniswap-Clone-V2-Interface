import Head from "next/head";
import { useSelector } from "react-redux";
import { selectUser } from "../src/state";
import SwapInterface from "../src/components/swap/SwapInterface";
import styles from "../styles/Home.module.css";

const Home: React.FC = () => {
  const { address } = useSelector(selectUser);

  return (
    <>
      <Head>
        <title>BlockSwap</title>
        <meta name="description" content="World leading token exchange!" />
        <link rel="icon§" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <SwapInterface />
        <footer className={styles.footer}>
          <span id={styles.creator}>Made by REGO350</span>
          <span id={styles.address}>{address}</span>
        </footer>
      </main>
    </>
  );
};

export default Home;
