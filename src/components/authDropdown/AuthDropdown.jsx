"use client"

import React, { useState } from 'react'
import styles from "./authDropdown.module.css";
import Link from 'next/link';
import ThemeToggle from '../themeToggle/ThemeToggle';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import GoogleIcon from '@mui/icons-material/Google';
import { signIn, signOut, useSession } from 'next-auth/react';
import Spinner from '../spinner/Spinner';

const AuthDropdown = ({ setOpen, setMouseInZone }) => {

  const { status } = useSession();

  if(status === "Loading"){
    return <Spinner />
  }

  const [index, setIndex] = useState(0);

  const handleScroll = (direction) => {
    if(direction === "l") {
        setIndex(index !== 0 ? 0 : 1)
    }
    if(direction === "r") {
        setIndex(index === 0 ? 1 : 0)
    }
}

  return (
  <>
  {(status === 'authenticated') ?
    <div 
      className={styles.container}
      onMouseEnter={()=>setMouseInZone(true)}
      onMouseLeave={()=>setMouseInZone(false)}
      onBlur={()=>setOpen(false)}
      tabIndex="0">
      <div className={styles.leftContainer} style={{transform:`translateX(${-210*index}px)`}}>
        <div className={styles.link} onClick={()=>handleScroll("r")}>
            <SettingsIcon style={{fontSize:"18px"}} />
            <div className={styles.linkSettingsText}>
              <span>Settings</span>
              <ChevronRightIcon style={{fontSize:"18px"}} />
            </div>
        </div>
        <div onClick={()=>setOpen(false)}>
          <Link className={styles.link} href="/write" passHref>
            <CreateIcon style={{fontSize:"18px"}} />
            <span>Write</span>
          </Link>
        </div>
        <div className={styles.link} onClick={()=>setOpen(false)}>
            <LogoutIcon style={{fontSize:"18px"}} />
            <span onClick={signOut}>Logout</span>
        </div>
      </div>
      <div className={styles.rightContainer} style={{transform:`translateX(${-210*index}px)`}}>
        <div onClick={()=>handleScroll("l")} style={{width: "max-content", cursor:"pointer"}}><ChevronLeftIcon /></div>
        <div className={styles.linkTheme}>
          <ThemeToggle />
          <span>Change theme</span>
        </div>
      </div>
    </div>
    :<div 
      className={styles.container}
      onMouseEnter={()=>setMouseInZone(true)}
      onMouseLeave={()=>setMouseInZone(false)}
      onBlur={()=>setOpen(false)}
      tabIndex="0">
      <div className={styles.link} onClick={()=>signIn("google")}>
        <GoogleIcon style={{fontSize: "18px"}} />
        <span>Log in with Google</span>
      </div>
    </div>}
  </>
  )
}

export default AuthDropdown