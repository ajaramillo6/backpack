import React from 'react'
import styles from "./featured.module.css";
import Slider from '../slider/Slider';

const Featured = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Top Places to Travel in {new Date().getFullYear()}
      </h1>
      {/* <Slider /> */}
    </div>
  )
}

export default Featured