import React from 'react'
import Link from 'next/link'
import styles from "./Layout.module.css";

const MainNavigation: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>DontApeThis</div>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/staking">Staking</Link>
          </li>
          <li>
            <Link href="/presale">Presale</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
