import Head from "next/head";
import SwapInterface from "../src/components/swap/SwapInterface";
import styles from "../styles/Home.module.css";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>BlockSwap</title>
        <meta name="description" content="World leading token exchange!" />
        <link rel="icon§" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <SwapInterface/>
        <footer>
          <span className={styles.creator}>Made by REGO350</span>
          <span>0x123</span>
        </footer>
      </main>
    </>
  );
}

export default Home;