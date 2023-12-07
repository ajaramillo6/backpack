"use client"
import React from 'react'
import styles from "./mobileNavbar.module.css";

//Tools
import { useSession } from 'next-auth/react';
import Link from 'next/link';

//MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';

const MobileNavbar = () => {

  //Find session
  const { data, status } = useSession();
  
  return (
    <div className={status === 'authenticated' ? styles.container:styles.containerLoggedOut}>
      <div className={styles.wrapper}>
        <Link className={styles.link} href='/'>
          <div className={styles.icon}>
            <HomeIcon />
          </div>
        </Link>
        {status === 'authenticated' &&
        <Link className={styles.link} href={`/following?user=${data?.user?.name}`} passHref>
          <div className={styles.icon}>
            <BookmarkIcon />
          </div>
        </Link>
        }
        <div className={styles.icon}>
          <LogoutIcon />
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar