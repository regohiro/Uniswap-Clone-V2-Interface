import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>DontApeThis</title>
        <meta name="description" content="World leading reflect token staking platform" />
        <link rel="icon§" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://dontapethis.com/">DontApeThis!</a>
        </h1>

        <p className={styles.description}>
          World leading Reflect token staking platform
        </p>

        <div className={styles.grid}>
          <a
            href="https://docs.dontapethis.com/tutorial"
            className={styles.card}
          >
            <h2>Quick Tutorials &rarr;</h2>
            <p>Beginner friendly tutorials with videos and pitucres.</p>
          </a>

          <a href="https://dontapethis.com/academy/whitepapers/whitepaper.pdf" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about DAT in an interactive course with quizzes!</p>
          </a>

          <a href="https://docs.dontapethis.com/" className={styles.card}>
            <h2>Whitepaper &rarr;</h2>
            <p>Find in-depth information about DAT features and potential.</p>
          </a>

          <a
            href="https://dontapethis.com/academy/whitepapers/technical_whitepaper.pdf"
            className={styles.card}
          >
            <h2>Technical Whitepaper &rarr;</h2>
            <p>Find and learn about our latest technology.</p>
          </a>
        </div>
      </main>
    </div>
  );
}

export default Home;