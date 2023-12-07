"use client"

import React, { useEffect, useState } from 'react'
import styles from "./authDropdown.module.css";

//Tools
import Link from 'next/link';

//Access data
import { signIn, signOut, useSession } from 'next-auth/react';

//Components
import ThemeToggle from '../themeToggle/ThemeToggle';
import Spinner from '../spinner/Spinner';

//MUI Icons
import CreateIcon from '@mui/icons-material/Create';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import GoogleIcon from '@mui/icons-material/Google';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { fetcher } from '@/src/getData';
import useSWR from 'swr';

const AuthDropdown = ({ setOpen, setMouseInZone }) => {

  //Find authentication status
  const { status, data } = useSession();

  const page = 1;
  const userName = data?.user?.name;
  const userEmail = data?.user?.email;

  const drafts = useSWR(
    `http://localhost:3000/api/drafts?user=${userName}&page=${page}`,
    fetcher
  );

  //Use states
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(()=>{
    if((userEmail === 'megandunnavant4@gmail.com') || (userEmail === 'laurenjdunnavant@gmail.com')){
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  },[userEmail])

  //Handle functions
  const handleSignIn = async() => {
    try{
      setLoading(true);
      setError(false);
      await signIn("google");
    }catch(err){
      setLoading(false);
      setError(true);
      console.log(err);
    }
  }

  const handleSignOut = async() => {
    try{
      await signOut();
    }catch(err){
      console.log(err);
    }
  }

  const handleScroll = (direction) => {
    if(direction === "l") {
        setIndex(index !== 0 ? 0 : 1)
    }
    if(direction === "r") {
        setIndex(index === 0 ? 1 : 0)
    }
  }

  //Handle loading
  if(loading){
    return (
      <div className={styles.containerLoading}>
        <div className={styles.linkGoogle}>
          <GoogleIcon style={{fontSize: "18px"}} />
          <span>Log in with Google</span>
        </div>
        <Spinner />
      </div>
    )
  }

  //Handle error
  if(error){
    return (
      <div className={styles.containerError}>
        <div className={styles.linkGoogle}>
          <GoogleIcon style={{fontSize: "18px"}} />
          <span>Log in with Google</span>
        </div>
        <span className={styles.errorWrapper}>
          <ErrorOutlineIcon />
          <p className={styles.errorText}>Something went wrong!</p>
        </span>
      </div>
    )
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
      <div className={styles.mobileContainer}>
        <ThemeToggle />
        <span>Change theme</span>
      </div>
      <div className={styles.leftContainer} style={{transform:`translateX(${-210*index}px)`}}>
        <div className={styles.link} onClick={()=>handleScroll("r")}>
          <SettingsIcon style={{fontSize:"18px"}} />
          <div className={styles.linkSettingsText}>
            <span>Settings</span>
            <ChevronRightIcon style={{fontSize:"18px"}} />
          </div>
        </div>
        {authorized && (<>
        <div onClick={()=>setOpen(false)}>
          <Link className={styles.link} href="/write" passHref>
            <CreateIcon style={{fontSize:"18px"}} />
            <span>Write</span>
          </Link>
        </div>
        <div onClick={()=>setOpen(false)}>
          <Link className={styles.link} href={`/drafts?user=${data?.user?.name}`} passHref>
            <EditNoteIcon style={{fontSize:"22px"}} />
            <div className={styles.draftsWrapper}>
              <span>Drafts</span>
              {drafts?.data?.count > 0 && <div className={styles.number}>{drafts?.data?.count}</div>}
            </div>
          </Link>
        </div>
        </>)}
        <div className={styles.link} onClick={()=>setOpen(false)}>
          <LogoutIcon style={{fontSize:"18px"}} />
          <span onClick={handleSignOut}>Logout</span>
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
    :<div className={styles.container}>
      <div className={styles.linkGoogle} onClick={handleSignIn}>
        <GoogleIcon style={{fontSize: "18px"}} />
        <span>Log in with Google</span>
      </div>
    </div>}
  </>
  )
}

export default AuthDropdown