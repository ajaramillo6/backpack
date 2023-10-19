import React from 'react';
import styles from './progressBar.module.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.container}>
        <div className={styles.bar}>
            <div className={styles.fill} style={{width: `${progress}%`}} />
        </div>
        <div className={styles.text}>{(progress < 100) ? (progress.toFixed(0) + "%"):"Upload complete!"}</div>
    </div>
  )
}

export default ProgressBar