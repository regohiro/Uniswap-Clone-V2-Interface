import React from "react";
import styles from "./Layout.module.css";
import ConnectButton from "../ConnectButton";

const MainNavigation: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Block Swap</h1>
      <ConnectButton/>
    </header>
  );
};

export default MainNavigation;