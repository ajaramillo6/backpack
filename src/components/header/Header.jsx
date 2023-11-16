import React from 'react'
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Top Places to Travel in {new Date().getFullYear()}
      </h1>
    </div>
  )
}

export default Header;