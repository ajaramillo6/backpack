import React from 'react'
import styles from "./mobileNavbar.module.css";
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const MobileNavbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <HomeIcon />
        </div>
        <div className={styles.icon}>
          <BookmarkIcon />
        </div>
        <div className={styles.icon}>
          <AccountCircleIcon />
        </div>
        <div className={styles.icon}>
          <LogoutIcon />
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar